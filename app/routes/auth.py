# app/routes/auth.py

from flask import Blueprint, request, jsonify
import jwt
from app.db.connection import get_db_connection
from app.utils.hash_utils import check_password  # Asegúrate de que esta utilidad está correctamente implementada
import os
import datetime
import logging
from app.two_factor.utils import generate_verification_code, send_verification_email
from app.utils.decorators import token_required  # Importar el decorador centralizado

# Configurar logging
logging.basicConfig(filename='error.log', level=logging.ERROR)
logger = logging.getLogger(__name__)

# Inicializar el Blueprint para las rutas de autenticación
auth_blueprint = Blueprint('auth_blueprint', __name__)

# Obtener la SECRET_KEY para JWT desde las variables de entorno
SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your_default_jwt_secret_key')
if not SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY no está configurada en las variables de entorno.")

@auth_blueprint.route("/login", methods=["POST"])
def login():
    """
    Inicia sesión validando email y password con bcrypt.
    Si two_factor_enabled == TRUE en la tabla 'users', requiere 2FA.
    De lo contrario, se genera el token JWT directamente.
    """
    data = request.get_json()
    logger.info(f"Received data at /login: {data}")

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        logger.warning("Missing data: Email or password not provided")
        return jsonify({"error": "Email and password are required."}), 400

    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            # Consultar la tabla 'users' para obtener datos de inicio de sesión y 2FA
            cursor.execute("""
                SELECT user_id, username, password_hash, preferred_language, two_factor_enabled
                FROM users
                WHERE email = %s;
            """, (email,))
            row = cursor.fetchone()

            if not row:
                logger.warning(f"User not found for email: {email}")
                return jsonify({"error": "User not found."}), 404

            user_id, username, password_hash_str, preferred_language, two_factor_enabled = row
            logger.info(
                f"DEBUG /login -> user_id={user_id}, username={username}, "
                f"preferred_language={preferred_language}, two_factor_enabled={two_factor_enabled}"
            )

            # Verificar contraseña con bcrypt (check_password)
            if check_password(password, password_hash_str):
                if two_factor_enabled:
                    # 2FA está activado: generar y enviar código de verificación por email
                    code = generate_verification_code()
                    send_verification_email(email, code)

                    # Guardar el código en la tabla two_factor_codes
                    expires_at = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=10)
                    cursor.execute("""
                        INSERT INTO two_factor_codes (user_id, code, method, expires_at, attempts, created_at)
                        VALUES (%s, %s, %s, %s, %s, NOW());
                    """, (user_id, code, 'email', expires_at, 0))
                    conn.commit()

                    logger.info(f"2FA enabled for user_id={user_id}; sent email to {email}")
                    return jsonify({
                        "message": "A verification code has been sent to your email. Please verify to complete login.",
                        "twoFactorRequired": True
                    }), 200

                else:
                    # 2FA no está habilitado: inicio de sesión inmediato
                    current_utc_time = datetime.datetime.now(datetime.timezone.utc)
                    cursor.execute("""
                        UPDATE personal_details
                        SET last_access = %s
                        WHERE user_id = %s
                        RETURNING last_access;
                    """, (current_utc_time, user_id))
                    updated_row = cursor.fetchone()

                    if not updated_row:
                        conn.rollback()
                        logger.error(f"Could not update last_access for user_id={user_id}")
                        return jsonify({"error": "Error updating last access time."}), 500

                    conn.commit()

                    # Generar un token JWT con expiración de 24 horas
                    token = jwt.encode({
                        'user_id': user_id,
                        'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
                    }, SECRET_KEY, algorithm="HS256")

                    logger.info(f"User {user_id} authenticated without 2FA.")
                    return jsonify({
                        "message": "Login successful.",
                        "token": token,
                        "user_id": user_id,
                        "username": username,
                        "preferred_language": preferred_language,
                        "last_access": updated_row[0].isoformat() if updated_row[0] else None
                    }), 200

            else:
                logger.warning(f"Incorrect password for {email}")
                return jsonify({"error": "Incorrect password."}), 401

    except Exception as e:
        # No es necesario hacer rollback manualmente ya que el context manager lo maneja
        logger.error(f"Error during login: {e}", exc_info=True)
        return jsonify({"error": "Internal server error."}), 500


@auth_blueprint.route("/verify-2fa", methods=["POST"])
def verify_2fa():
    """
    Verifica el código de 2FA enviado al email del usuario. Emite un nuevo token JWT al verificar exitosamente.
    """
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')

    if not email or not code:
        return jsonify({"error": "Email and verification code are required."}), 400

    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            # Obtener user_id y username desde la tabla 'users'
            cursor.execute("""
                SELECT user_id, username
                FROM users
                WHERE email = %s;
            """, (email,))
            row = cursor.fetchone()
            if not row:
                return jsonify({"error": "User not found."}), 404

            user_id, username = row

            # Buscar el código en two_factor_codes (que no haya expirado)
            cursor.execute("""
                SELECT id, code, expires_at, attempts
                FROM two_factor_codes
                WHERE user_id = %s AND code = %s AND expires_at > %s
                ORDER BY created_at DESC
                LIMIT 1;
            """, (user_id, code, datetime.datetime.now(datetime.timezone.utc)))
            code_row = cursor.fetchone()

            if not code_row:
                return jsonify({"error": "Invalid or expired verification code."}), 400

            code_id, stored_code, expires_at, attempts = code_row

            if attempts >= 5:
                # Eliminar el código si se alcanzó el máximo de intentos
                cursor.execute("DELETE FROM two_factor_codes WHERE id = %s;", (code_id,))
                conn.commit()
                return jsonify({"error": "Maximum number of attempts reached."}), 400

            if code != stored_code:
                # Incrementar el contador de intentos
                cursor.execute("UPDATE two_factor_codes SET attempts = attempts + 1 WHERE id = %s;", (code_id,))
                conn.commit()
                return jsonify({"error": "Incorrect verification code."}), 400

            # Código correcto: eliminarlo de la base de datos
            cursor.execute("DELETE FROM two_factor_codes WHERE id = %s;", (code_id,))
            conn.commit()

            # Generar un nuevo token JWT con expiración de 24 horas
            token = jwt.encode({
                'user_id': user_id,
                'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
            }, SECRET_KEY, algorithm="HS256")

            logger.info(f"User {user_id} (username='{username}') authenticated with 2FA.")
            return jsonify({
                "message": "2FA verification successful.",
                "token": token,
                "user_id": user_id,
                "username": username,
                "last_access": None
            }), 200

    except Exception as e:
        logger.error(f"Error during 2FA verification: {e}", exc_info=True)
        return jsonify({"error": "Internal server error."}), 500


@auth_blueprint.route("/me", methods=["GET"])
@token_required
def get_current_user(user_id):
    """
    Retorna datos del usuario desde las tablas 'users' y 'personal_details'.
    
    Args:
        user_id (int): El ID del usuario autenticado, proporcionado por el decorador token_required.
    
    Returns:
        JSON con los detalles del usuario, o un mensaje de error.
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT u.user_id, u.username, u.email, u.preferred_language,
                       p.full_name, p.student_id, p.alt_email, p.contact_number,
                       p.id_type, p.id_number, p.birth_date, p.country_of_residence,
                       u.account_status, p.last_access
                FROM users u
                LEFT JOIN personal_details p ON u.user_id = p.user_id
                WHERE u.user_id = %s;
            """, (user_id,))
            row = cursor.fetchone()

            if row:
                user_data = {
                    "user_id": row[0],
                    "username": row[1],
                    "email": row[2],
                    "preferred_language": row[3],
                    "full_name": row[4],
                    "student_id": row[5],
                    "alt_email": row[6],
                    "contact_number": row[7],
                    "id_type": row[8],
                    "id_number": row[9],
                    "birth_date": row[10].isoformat() if row[10] else None,
                    "country_of_residence": row[11],
                    "account_status": row[12],
                    "last_access": row[13].isoformat() if row[13] else None
                }
                return jsonify({"user": user_data}), 200

            else:
                return jsonify({"error": "User not found."}), 404

    except Exception as e:
        logger.error(f"Error retrieving current user data for user_id {user_id}: {e}", exc_info=True)
        return jsonify({"error": "Internal server error."}), 500


@auth_blueprint.route("/preferred-language", methods=["GET"])
@token_required
def get_preferred_language(user_id):
    """
    Retorna el idioma preferido del usuario autenticado desde la tabla 'users'.
    
    Args:
        user_id (int): El ID del usuario autenticado, proporcionado por el decorador token_required.
    
    Returns:
        JSON con el idioma preferido, o un mensaje de error.
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT preferred_language 
                FROM users 
                WHERE user_id = %s;
            """, (user_id,))
            row = cursor.fetchone()

            if row:
                return jsonify({"preferredLanguage": row[0]}), 200
            else:
                return jsonify({"error": "User not found."}), 404

    except Exception as e:
        logger.error(f"Error retrieving preferred language for user_id {user_id}: {e}", exc_info=True)
        return jsonify({"error": "Internal server error."}), 500


@auth_blueprint.route("/preferred-language", methods=["PUT"])
@token_required
def update_preferred_language(user_id):
    """
    Actualiza el idioma preferido del usuario en la tabla 'users'.
    
    Args:
        user_id (int): El ID del usuario autenticado, proporcionado por el decorador token_required.
    
    Returns:
        JSON confirmando la actualización con el nuevo idioma preferido, o un mensaje de error.
    """
    data = request.get_json()
    preferred_language = data.get('preferredLanguage')

    if not preferred_language or preferred_language not in ['en', 'es']:
        return jsonify({"error": "Invalid language selection."}), 400

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
                response = {
                    "message": "Preferred language updated successfully.",
                    "preferredLanguage": row[0]
                }
                return jsonify(response), 200
            else:
                conn.rollback()
                return jsonify({"error": "User not found."}), 404

    except Exception as e:
        logger.error(f"Error updating preferred language for user_id {user_id}: {e}", exc_info=True)
        return jsonify({"error": "Internal server error."}), 500


@auth_blueprint.route("/users/<int:user_id>/email", methods=["PUT"])
@token_required
def update_user_email(current_user_id, user_id):
    """
    Actualiza el 'email' principal del usuario autenticado en la tabla 'users'.
    Verifica que el user_id en la URL coincida con el ID del usuario autenticado.
    
    Args:
        current_user_id (int): El ID del usuario autenticado, proporcionado por el decorador token_required.
        user_id (int): El ID del usuario a actualizar, extraído de la URL.
    
    Returns:
        JSON confirmando la actualización del email con los detalles del usuario, o un mensaje de error.
    """
    if current_user_id != user_id:
        logger.warning(f"Unauthorized email update attempt by user_id {current_user_id} for user_id {user_id}")
        return jsonify({"error": "Unauthorized access."}), 403

    data = request.get_json()
    new_email = data.get('email')
    if not new_email:
        return jsonify({"error": "New email is required."}), 400

    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            # Verificar si el nuevo email ya está en uso
            cursor.execute("SELECT user_id FROM users WHERE email = %s;", (new_email,))
            row = cursor.fetchone()
            if row:
                return jsonify({"error": "This email is already in use."}), 409

            # Actualizar el email del usuario
            cursor.execute("""
                UPDATE users
                SET email = %s
                WHERE user_id = %s
                RETURNING user_id, username, email;
            """, (new_email, user_id))
            updated_row = cursor.fetchone()

            if not updated_row:
                conn.rollback()
                logger.warning(f"User not found for email update: user_id {user_id}")
                return jsonify({"error": "User not found."}), 404

            conn.commit()
            logger.info(f"Primary email updated for user_id={user_id} => {new_email}")

            response = {
                "message": "Primary email updated successfully.",
                "user_id": updated_row[0],
                "username": updated_row[1],
                "email": updated_row[2]
            }
            return jsonify(response), 200

    except Exception as e:
        logger.error(f"Error updating email for user_id {user_id}: {e}", exc_info=True)
        return jsonify({"error": "Internal server error."}), 500
