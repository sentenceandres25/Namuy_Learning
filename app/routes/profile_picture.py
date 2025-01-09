# routes/profile_picture.py

from flask import Blueprint, request, jsonify, current_app
from db.connection import get_db_connection
import pg8000.dbapi
import logging
import os
import datetime
from werkzeug.utils import secure_filename

profile_picture_blueprint = Blueprint('profile_picture_blueprint', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    """
    Verifica si un nombre de archivo tiene una extensión permitida.
    """
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@profile_picture_blueprint.route("/<int:user_id>", methods=["GET"])
def get_profile_picture(user_id):
    """
    Retorna la URL de la foto de perfil si existe.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT picture_url
            FROM profile_pictures
            WHERE user_id = %s
            ORDER BY profile_picture_id DESC
            LIMIT 1;
        """, (user_id,))
        row = cursor.fetchone()
        if row and row[0]:
            return jsonify({"picture_url": row[0]}), 200
        else:
            return jsonify({"picture_url": None}), 200
    except Exception as e:
        logging.error(f"Error al obtener foto de perfil user_id={user_id}: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@profile_picture_blueprint.route("/<int:user_id>", methods=["POST"])
def upload_profile_picture(user_id):
    """
    Sube/actualiza la foto de perfil.
    Espera la imagen en 'file' dentro del multipart/form-data.
    Guarda la ruta en la base de datos (profile_pictures.picture_url).
    """
    if 'file' not in request.files:
        return jsonify({"error": "No se encontró la imagen en la solicitud"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No se seleccionó ningún archivo"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Archivo no permitido. Solo png, jpg, jpeg, gif"}), 400

    # Crear la carpeta uploads/user_<user_id> si no existe
    upload_folder = os.path.join(current_app.root_path, 'uploads', f"user_{user_id}")
    os.makedirs(upload_folder, exist_ok=True)

    # Definir un nombre único para la foto (e.g., profilePic_fecha.ext)
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    ext = file.filename.rsplit('.', 1)[1].lower()
    filename = secure_filename(f"profilePic_{timestamp}.{ext}")
    file_path = os.path.join(upload_folder, filename)
    file.save(file_path)

    # La URL que se guardará en la DB
    # (ejemplo: /uploads/user_11/profilePic_20231231_235900.jpg)
    picture_url = f"/uploads/user_{user_id}/{filename}"

    # Guardar en la DB
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Insertar en la tabla profile_pictures
        cursor.execute("""
            INSERT INTO profile_pictures (user_id, picture_url)
            VALUES (%s, %s)
            RETURNING profile_picture_id;
        """, (user_id, picture_url))
        profile_pic_id = cursor.fetchone()[0]
        conn.commit()

        return jsonify({
            "message": "Foto de perfil actualizada",
            "profile_picture_id": profile_pic_id,
            "picture_url": picture_url
        }), 200

    except Exception as e:
        conn.rollback()
        logging.error(f"Error al subir foto de perfil user_id={user_id}: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()
