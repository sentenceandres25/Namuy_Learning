from flask import Blueprint, request, jsonify
from db.connection import get_db_connection
from utils.hash_utils import hash_password
from utils.validators import validate_user_data
import pg8000.dbapi
import logging

from utils.decorators import token_required  # Asegúrate de tenerlo

users_blueprint = Blueprint('users_blueprint', __name__)

@users_blueprint.route("", methods=["POST"])
def create_user():
    """
    Crea un nuevo usuario en la tabla 'users' y su registro en 'personal_details'.
    Hashea la contraseña con bcrypt y almacena en password_hash.
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

        # Idioma preferido por default 'es' si no es 'en' o 'es'
        preferred_language = data.get('preferred_language', 'es')
        if preferred_language not in ['en', 'es']:
            preferred_language = 'es'

        # Insertar en tabla 'users'
        cursor.execute("""
            INSERT INTO users (username, email, password_hash, preferred_language)
            VALUES (%s, %s, %s, %s)
            RETURNING user_id, username, email, date_joined, preferred_language;
        """, (data['username'], data['email'], hashed_str, preferred_language))
        user_row = cursor.fetchone()
        user_id = user_row[0]

        # Crear registro en 'personal_details'
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
        return jsonify({"error": "Email o username ya está en uso"}), 409
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
        cursor.execute("SELECT preferred_language FROM users WHERE user_id = %s;", (current_user_id,))
        row = cursor.fetchone()
        if row:
            return jsonify({"preferredLanguage": row[0]}), 200
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
            return jsonify({
                "message": "Idioma preferido actualizado correctamente",
                "preferredLanguage": row[0]
            }), 200
        else:
            conn.rollback()
            return jsonify({"error": "Usuario no encontrado"}), 404
    except Exception as e:
        conn.rollback()
        logging.error(f"Error en /preferred-language (PUT): {e}", exc_info=True)
        return jsonify({"error": "Error interno del servidor"}), 500
    finally:
        conn.close()


@users_blueprint.route("/<int:user_id>/email", methods=["PUT"])
@token_required
def update_user_email(current_user_id, user_id):
    """
    Actualiza el 'email' principal en la tabla 'users'.
    - Verifica que user_id == current_user_id (no se permite de otro user).
    - Si el email ya existe en OTRO user, 409 conflict.
    - Si es el mismo user, no conflict.
    """
    if current_user_id != user_id:
        return jsonify({"error": "Acceso no autorizado"}), 403

    data = request.get_json()
    new_email = data.get('email')
    if not new_email:
        return jsonify({"error": "Falta el nuevo correo"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Verificar si ese 'new_email' ya existe en la tabla users
        cursor.execute("SELECT user_id FROM users WHERE email = %s", (new_email,))
        row = cursor.fetchone()
        if row:
            # Si el user_id que tiene new_email es distinto => conflict
            if row[0] != user_id:
                conn.rollback()
                return jsonify({"error": "Este correo ya está en uso"}), 409
            else:
                # row[0] == user_id => es el mismo user, no conflict
                pass

        # Actualizar email en 'users'
        cursor.execute("""
            UPDATE users
            SET email = %s
            WHERE user_id = %s
            RETURNING user_id, username, email;
        """, (new_email, user_id))
        updated_row = cursor.fetchone()

        if not updated_row:
            conn.rollback()
            return jsonify({"error": "Usuario no encontrado"}), 404

        conn.commit()
        logging.info(f"Email principal actualizado user_id={user_id} => {new_email}")

        return jsonify({
            "message": "Correo principal actualizado correctamente",
            "user_id": updated_row[0],
            "username": updated_row[1],
            "email": updated_row[2]
        }), 200

    except Exception as e:
        conn.rollback()
        logging.error(f"Error al actualizar email en users: {e}", exc_info=True)
        return jsonify({"error": "Error interno del servidor"}), 500
    finally:
        conn.close()
