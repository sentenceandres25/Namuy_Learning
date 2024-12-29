# routes/users.py

from flask import Blueprint, request, jsonify
from db.connection import get_db_connection
from utils.hash_utils import hash_password
from utils.validators import validate_user_data
import pg8000.dbapi
import logging

users_blueprint = Blueprint('users_blueprint', __name__)

@users_blueprint.route("", methods=["POST"])
def create_user():
    """
    Crea un nuevo usuario en la tabla 'users' y su registro inicial en 'personal_details'.
    - Hashea la contraseña con bcrypt y la almacena como texto (formato $2b$...).
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

        cursor.execute("""
            INSERT INTO users (username, email, password_hash)
            VALUES (%s, %s, %s)
            RETURNING user_id, username, email, date_joined;
        """, (data['username'], data['email'], hashed_str))

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
