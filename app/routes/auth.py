from flask import Blueprint, request, jsonify
import jwt
import os
import datetime
import logging
from app.db.connection import get_db_connection
from app.two_factor.utils import generate_verification_code, send_verification_email
from app.utils.decorators import token_required
from app.utils.hash_utils import check_password  # tu función para verificar bcrypt

# Configurar logging
logging.basicConfig(filename='error.log', level=logging.ERROR)
logger = logging.getLogger(__name__)

auth_blueprint = Blueprint('auth_blueprint', __name__)

SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your_default_jwt_secret_key')
if not SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY no está configurada en las variables de entorno.")

@auth_blueprint.route("/login", methods=["POST"])
def login():
    """
    Inicia sesión validando email y password con bcrypt.
    Si two_factor_enabled == TRUE, requiere 2FA. De lo contrario, genera token JWT con session_id
    y crea/reutiliza un registro en user_sessions (una sola vez).
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

            # Verificar contraseña
            if check_password(password, password_hash_str):
                # Si 2FA está activo, no creamos sesión ni token todavía
                if two_factor_enabled:
                    code = generate_verification_code()
                    send_verification_email(email, code)
                    expires_at = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=10)
                    cursor.execute("""
                        INSERT INTO two_factor_codes (user_id, code, method, expires_at, attempts, created_at)
                        VALUES (%s, %s, %s, %s, %s, NOW());
                    """, (user_id, code, 'email', expires_at, 0))
                    conn.commit()

                    logger.info(f"2FA enabled for user_id={user_id}; sent code to {email}")
                    return jsonify({
                        "message": "A verification code has been sent to your email. Please verify to complete login.",
                        "twoFactorRequired": True
                    }), 200
                else:
                    # 2FA no habilitado -> login inmediato
                    current_utc_time = datetime.datetime.now(datetime.timezone.utc)
                    cursor.execute("""
                        UPDATE personal_details
                        SET last_access = %s
                        WHERE user_id = %s
                        RETURNING last_access;
                    """, (current_utc_time, user_id))
                    updated_row = cursor.fetchone()
                    conn.commit()

                    # Crear/reutilizar la sesión en user_sessions
                    device = request.headers.get("X-Device-Info")
                    if not device or not device.strip():
                        device = request.headers.get("User-Agent", "Unknown Device")

                    location = request.remote_addr or "Unknown Location"

                    cursor.execute("""
                        SELECT session_id
                        FROM user_sessions
                        WHERE user_id = %s AND device = %s
                        ORDER BY login_at DESC
                        LIMIT 1;
                    """, (user_id, device))
                    existing_session = cursor.fetchone()

                    if existing_session:
                        session_id = existing_session[0]
                        # Actualizar login_at y location
                        cursor.execute("""
                            UPDATE user_sessions
                            SET login_at = NOW(),
                                location = %s
                            WHERE session_id = %s
                            RETURNING session_id;
                        """, (location, session_id))
                        srow = cursor.fetchone()
                        session_id = srow[0]
                        conn.commit()
                    else:
                        # Insertar nueva sesión
                        cursor.execute("""
                            INSERT INTO user_sessions (user_id, device, location)
                            VALUES (%s, %s, %s)
                            RETURNING session_id;
                        """, (user_id, device, location))
                        session_id = cursor.fetchone()[0]
                        conn.commit()

                    # Generar token con session_id
                    token_payload = {
                        'user_id': user_id,
                        'session_id': session_id,
                        'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
                    }
                    token = jwt.encode(token_payload, SECRET_KEY, algorithm="HS256")

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
        logger.error(f"Error during login: {e}", exc_info=True)
        return jsonify({"error": "Internal server error."}), 500


@auth_blueprint.route("/verify-2fa", methods=["POST"])
def verify_2fa():
    """
    Verifica el código de 2FA (email). Si es correcto, crea/reutiliza sesión y 
    genera token con session_id. Retorna 200 junto con token.
    """
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')

    if not email or not code:
        return jsonify({"error": "Email and verification code are required."}), 400

    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT user_id, username
                FROM users
                WHERE email = %s;
            """, (email,))
            row = cursor.fetchone()
            if not row:
                return jsonify({"error": "User not found."}), 404

            user_id, username = row

            # Buscar el código
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
                cursor.execute("DELETE FROM two_factor_codes WHERE id = %s;", (code_id,))
                conn.commit()
                return jsonify({"error": "Maximum number of attempts reached."}), 400

            if code != stored_code:
                cursor.execute("UPDATE two_factor_codes SET attempts = attempts + 1 WHERE id = %s;", (code_id,))
                conn.commit()
                return jsonify({"error": "Incorrect verification code."}), 400

            # Código correcto: lo eliminamos
            cursor.execute("DELETE FROM two_factor_codes WHERE id = %s;", (code_id,))
            conn.commit()

            # Actualizar last_access
            current_utc_time = datetime.datetime.now(datetime.timezone.utc)
            cursor.execute("""
                UPDATE personal_details
                SET last_access = %s
                WHERE user_id = %s
                RETURNING last_access;
            """, (current_utc_time, user_id))
            updated_row = cursor.fetchone()
            conn.commit()

            # Crear o reutilizar la sesión
            device = request.headers.get("X-Device-Info")
            if not device or not device.strip():
                device = request.headers.get("User-Agent", "Unknown Device")

            location = request.remote_addr or "Unknown Location"

            cursor.execute("""
                SELECT session_id
                FROM user_sessions
                WHERE user_id = %s AND device = %s
                ORDER BY login_at DESC
                LIMIT 1;
            """, (user_id, device))
            existing_session = cursor.fetchone()
            if existing_session:
                session_id = existing_session[0]
                cursor.execute("""
                    UPDATE user_sessions
                    SET login_at = NOW(),
                        location = %s
                    WHERE session_id = %s
                    RETURNING session_id;
                """, (location, session_id))
                srow = cursor.fetchone()
                session_id = srow[0]
                conn.commit()
            else:
                cursor.execute("""
                    INSERT INTO user_sessions (user_id, device, location)
                    VALUES (%s, %s, %s)
                    RETURNING session_id;
                """, (user_id, device, location))
                session_id = cursor.fetchone()[0]
                conn.commit()

            # Generar el token con session_id
            token_payload = {
                'user_id': user_id,
                'session_id': session_id,
                'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
            }
            token = jwt.encode(token_payload, SECRET_KEY, algorithm="HS256")

            return jsonify({
                "message": "2FA verification successful.",
                "token": token,
                "user_id": user_id,
                "username": username,
                "last_access": updated_row[0].isoformat() if updated_row[0] else None
            }), 200

    except Exception as e:
        logger.error(f"Error during 2FA verification: {e}", exc_info=True)
        return jsonify({"error": "Internal server error."}), 500


@auth_blueprint.route("/me", methods=["GET"])
@token_required
def get_current_user(user_id):
    """
    Retorna datos del usuario desde 'users' y 'personal_details'.
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


# (Se han eliminado los endpoints repetidos de /preferred-language en este blueprint)
# Todo lo referente a GET/PUT del idioma se deja en el users_blueprint
