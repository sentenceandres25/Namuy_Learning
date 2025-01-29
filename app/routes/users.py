# app/routes/users.py

from flask import Blueprint, request, jsonify
from app.db.connection import get_db_connection
from app.utils.hash_utils import hash_password
from app.utils.validators import validate_user_data
from app.utils.decorators import token_required
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from psycopg2 import errors  # Cambiado de pg8000.dbapi a psycopg2.errors
import logging

# Initialize the Blueprint for user-related routes
users_blueprint = Blueprint('users_blueprint', __name__, url_prefix='/api/users')

# Initialize the Rate Limiter specifically for this Blueprint
limiter = Limiter(
    key_func=get_remote_address
)

# Apply rate limiting to the Blueprint
users_blueprint.before_request(limiter.check)


@users_blueprint.route("", methods=["POST"])
@limiter.limit("10 per minute")  # Example: Limit to 10 requests per minute
def create_user():
    """
    Crea un nuevo usuario en la tabla 'users' y un registro correspondiente en 'personal_details'.
    La contraseña se hashea usando bcrypt y se almacena en 'password_hash'.
    
    Returns:
        JSON con los datos del usuario creado o un mensaje de error.
    """
    data = request.get_json()

    # Validar los datos de entrada del usuario
    validation_error = validate_user_data(data)
    if validation_error:
        return jsonify({"error": validation_error}), 400

    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            # Hashear la contraseña del usuario
            hashed_bytes = hash_password(data['password'])  # bcrypt retorna bytes
            hashed_str = hashed_bytes.decode('utf-8')

            # Establecer el idioma preferido por defecto a 'es' si no es 'en' o 'es'
            preferred_language = data.get('preferred_language', 'es')
            if preferred_language not in ['en', 'es']:
                preferred_language = 'es'

            # Insertar el nuevo usuario en la tabla 'users'
            cursor.execute("""
                INSERT INTO users (username, email, password_hash, preferred_language)
                VALUES (%s, %s, %s, %s)
                RETURNING user_id, username, email, date_joined, preferred_language;
            """, (data['username'], data['email'], hashed_str, preferred_language))
            user_row = cursor.fetchone()
            user_id = user_row[0]

            # Crear un registro correspondiente en 'personal_details'
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

            # Commit de la transacción
            conn.commit()

            # Preparar los datos de respuesta
            user_data = {
                "user_id": user_id,
                "username": user_row[1],
                "email": user_row[2],
                "date_joined": user_row[3].isoformat(),
                "preferred_language": user_row[4],
                "personal_detail_id": personal_detail_id
            }
            return jsonify(user_data), 201

    except errors.UniqueViolation:
        # Manejar email o username duplicados
        logging.warning(f"Duplicate email or username attempted: {data.get('email')}, {data.get('username')}")
        return jsonify({"error": "Email or username already in use"}), 409
    except Exception as e:
        # Registrar errores inesperados
        logging.error(f"Error en create_user: {e}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500


@users_blueprint.route("/preferred-language", methods=["GET"])
@token_required
@limiter.limit("100 per hour")  # Example: Limit to 100 requests per hour
def get_preferred_language(user_id):
    """
    Recupera el idioma preferido del usuario autenticado.
    
    Args:
        user_id (int): El ID del usuario autenticado, proporcionado por el decorador token_required.
    
    Returns:
        JSON con el idioma preferido, o un mensaje de error.
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT preferred_language FROM users WHERE user_id = %s;", (user_id,))
            row = cursor.fetchone()
            if row:
                return jsonify({"preferredLanguage": row[0]}), 200
            else:
                return jsonify({"error": "User not found"}), 404
    except Exception as e:
        logging.error(f"Error en GET /users/preferred-language para user_id={user_id}: {e}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500


@users_blueprint.route("/preferred-language", methods=["PUT"])
@token_required
@limiter.limit("50 per hour")  # Example: Limit to 50 requests per hour
def update_preferred_language(user_id):
    """
    Actualiza el idioma preferido del usuario autenticado.
    
    Args:
        user_id (int): El ID del usuario autenticado, proporcionado por el decorador token_required.
    
    Returns:
        JSON confirmando la actualización o un mensaje de error.
    """
    data = request.get_json()
    preferred_language = data.get('preferredLanguage')

    # Validar el idioma preferido
    if not preferred_language or preferred_language not in ['en', 'es']:
        return jsonify({"error": "Invalid language"}), 400

    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE users
                SET preferred_language = %s
                WHERE user_id = %s
                RETURNING preferred_language;
            """, (preferred_language, user_id))
            row = cursor.fetchone()
            if row:
                conn.commit()
                return jsonify({
                    "message": "Preferred language updated successfully",
                    "preferredLanguage": row[0]
                }), 200
            else:
                return jsonify({"error": "User not found"}), 404
    except Exception as e:
        logging.error(f"Error en PUT /users/preferred-language para user_id={user_id}: {e}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500


@users_blueprint.route("/<int:user_id>/email", methods=["PUT"])
@token_required
@limiter.limit("30 per hour")  # Example: Limit to 30 requests per hour
def update_user_email(current_user_id, user_id):
    """
    Actualiza el correo electrónico principal en la tabla 'users'.
    - Asegura que user_id coincide con current_user_id (previene acceso no autorizado).
    - Si el email ya existe para otro usuario, retorna un 409 Conflict.
    - Si el email es el mismo para el usuario actual, no ocurre conflicto.
    
    Args:
        current_user_id (int): El ID del usuario autenticado, proporcionado por el decorador token_required.
        user_id (int): El ID del usuario cuyo email se actualizará.
    
    Returns:
        JSON confirmando la actualización del email con los detalles del usuario, o un mensaje de error.
    """
    # Verificar que el usuario está actualizando su propio email
    if current_user_id != user_id:
        logging.warning(f"Unauthorized email update attempt by user_id {current_user_id} for user_id {user_id}")
        return jsonify({"error": "Unauthorized access"}), 403

    data = request.get_json()
    new_email = data.get('email')

    # Validar el nuevo email
    if not new_email:
        return jsonify({"error": "New email is required"}), 400

    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            # Verificar si el nuevo email ya está en uso por otro usuario
            cursor.execute("SELECT user_id FROM users WHERE email = %s;", (new_email,))
            row = cursor.fetchone()
            if row and row[0] != user_id:
                return jsonify({"error": "This email is already in use"}), 409

            # Actualizar el email en la tabla 'users'
            cursor.execute("""
                UPDATE users
                SET email = %s
                WHERE user_id = %s
                RETURNING user_id, username, email;
            """, (new_email, user_id))
            updated_row = cursor.fetchone()
            if not updated_row:
                return jsonify({"error": "User not found"}), 404

            # Commit de la transacción
            conn.commit()

            return jsonify({
                "message": "Primary email updated successfully",
                "user_id": updated_row[0],
                "username": updated_row[1],
                "email": updated_row[2]
            }), 200

    except Exception as e:
        logging.error(f"Error actualizando email para user_id={user_id}: {e}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500
