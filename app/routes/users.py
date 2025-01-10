# routes/users.py

from flask import Blueprint, request, jsonify
from db.connection import get_db_connection
from utils.hash_utils import hash_password
from utils.validators import validate_user_data
import pg8000.dbapi
import logging

from utils.decorators import token_required  # Importar el decorador
#fjkdljflkd
users_blueprint = Blueprint('users_blueprint', __name__)

@users_blueprint.route("", methods=["POST"])
def create_user():
    """
    Crea un nuevo usuario en la tabla 'users' y su registro inicial en 'personal_details'.
    - Hashea la contraseña con bcrypt y la almacena como texto (formato $2b$...).
    - Permite establecer el idioma preferido.
    """
    data = request.get_json()
    validation_error = validate_user_data(data)
    if validation_error:
        return jsonify({"error": validation_error}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        hashed_bytes = hash_password(data['password'])  # bcrypt retorna bytes
        hashed_str = hashed_bytes.decode('utf-8')

        # Obtener preferred_language, si no se proporciona, usar 'es'# Obtener preferred_language, si no se proporciona, usar 'es'
        preferred_language = data.get('preferred_language', 'es')
        if preferred_language not in ['en', 'es']:
            preferred_language = 'es'  # Fallback a 'es' si el valor es inválido

        cursor.execute("""
            INSERT INTO users (username, email, password_hash, preferred_language)
            VALUES (%s, %s, %s, %s)
            RETURNING user_id, username, email, date_joined, preferred_language;
        """, (data['username'], data['email'], hashed_str, preferred_language))

        user_row = cursor.fetchone()
        user_id = user_row[0]

        # Crear registro inicial en personal_details
        cursor.execute("""
            INSERT INTO personal_details (user_id, full_name, student_id, email)
            VALUES (%s, %s, %s, %s)
            RETURNING personal_detail_id;
        """, (
            user_id,
            data.get('full_name', ''),
            data.get('student_id', ''),
            data['email']
        ))
        personal_detail_id = cursor.fetchone()[0]

        conn.commit()

        user_data = {
            "user_id": user_id,
            "username": user_row[1],
            "email": user_row[2],
            "date_joined": user_row[3].isoformat(),
            "preferred_language": user_row[4],
            "personal_detail_id": personal_detail_id
        }
        return jsonify(user_data), 201

    except pg8000.dbapi.IntegrityError:
        conn.rollback()
        return jsonify({"error": "Email o nombre de usuario ya registrado"}), 409
    except Exception as e:
        conn.rollback()
        logging.error(f"Error en create_user: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@users_blueprint.route("/preferred-language", methods=["GET"])
@token_required
def get_preferred_language(current_user_id):
    """
    Obtiene el idioma preferido del usuario autenticado.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT preferred_language FROM users WHERE user_id = %s;
        """, (current_user_id,))
        row = cursor.fetchone()
        if row:
            preferred_language = row[0]
            return jsonify({"preferredLanguage": preferred_language}), 200
        else:
            return jsonify({"error": "Usuario no encontrado"}), 404
    except Exception as e:
        logging.error(f"Error en /preferred-language (GET): {e}", exc_info=True)
        return jsonify({"error": "Error interno del servidor"}), 500
    finally:
        conn.close()

@users_blueprint.route("/preferred-language", methods=["PUT"])
@token_required
def update_preferred_language(current_user_id):
    """
    Actualiza el idioma preferido del usuario autenticado.
    """
    data = request.get_json()
    preferred_language = data.get('preferredLanguage')

    if not preferred_language or preferred_language not in ['en', 'es']:
        return jsonify({"error": "Idioma inválido"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE users
            SET preferred_language = %s
            WHERE user_id = %s
            RETURNING preferred_language;
        """, (preferred_language, current_user_id))
        row = cursor.fetchone()
        if row:
            conn.commit()
            return jsonify({"message": "Idioma preferido actualizado correctamente", "preferredLanguage": row[0]}), 200
        else:
            conn.rollback()
            return jsonify({"error": "Usuario no encontrado"}), 404
    except Exception as e:
        conn.rollback()
        logging.error(f"Error en /preferred-language (PUT): {e}", exc_info=True)
        return jsonify({"error": "Error interno del servidor"}), 500
    finally:
        conn.close()
