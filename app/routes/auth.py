# app/routes/auth.py

from flask import Blueprint, request, jsonify
import jwt
from functools import wraps
from app.db.connection import get_db_connection
from app.utils.hash_utils import check_password
import os
import datetime
import logging
from app.two_factor.utils import generate_verification_code, send_verification_email

auth_blueprint = Blueprint('auth_blueprint', __name__)

SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'tu_clave_secreta_jwt')
if not SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY no está configurada en el .env")

logging.basicConfig(filename='error.log', level=logging.ERROR)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # Tomamos el header Authorization y separamos 'Bearer <token>'
        if 'Authorization' in request.headers:
            parts = request.headers['Authorization'].split()
            if len(parts) == 2 and parts[0] == 'Bearer':
                token = parts[1]

        if not token:
            return jsonify({'error': 'Token de autorización faltante'}), 401

        try:
            # Decodificar el token usando la SECRET_KEY
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user_id = data.get('user_id')
            if not current_user_id:
                return jsonify({'error': 'Token inválido: falta user_id'}), 401

        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token inválido'}), 401

        return f(current_user_id, *args, **kwargs)
    return decorated


@auth_blueprint.route("/login", methods=["POST"])
def login():
    """
    Inicia sesión validando email y password con bcrypt.
    Si two_factor_enabled == TRUE en la tabla 'users', requiere 2FA.
    De lo contrario, se genera el token JWT directamente.
    """
    data = request.get_json()
    logging.info(f"Datos recibidos en /login: {data}")

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        logging.warning("Faltan datos: Email o contraseña no proporcionados")
        return jsonify({"error": "Email y contraseña requeridos"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Consultar la tabla 'users' para obtener datos de inicio de sesión y 2FA
        cursor.execute("""
            SELECT user_id, username, password_hash, preferred_language, two_factor_enabled
            FROM users
            WHERE email = %s
        """, (email,))
        row = cursor.fetchone()

        if not row:
            logging.warning(f"Usuario no encontrado para el email: {email}")
            return jsonify({"error": "Usuario no encontrado"}), 404

        user_id, username, password_hash_str, preferred_language, two_factor_enabled = row
        logging.info(
            f"DEBUG /login -> user_id={user_id}, username={username}, "
            f"preferred_language={preferred_language}, two_factor_enabled={two_factor_enabled}"
        )

        # Verificar contraseña con bcrypt (check_password)
        if check_password(password, password_hash_str):
            if two_factor_enabled:
                # 1) 2FA está activado: generar código y enviarlo por email
                code = generate_verification_code()
                send_verification_email(email, code)

                # Guardar el código en la tabla two_factor_codes
                expires_at = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=10)
                cursor.execute("""
                    INSERT INTO two_factor_codes (user_id, code, method, expires_at, attempts, created_at)
                    VALUES (%s, %s, %s, %s, %s, NOW())
                """, (user_id, code, 'email', expires_at, 0))
                conn.commit()

                logging.info(f"2FA habilitado para user_id={user_id}; se envió email a {email}")
                return jsonify({
                    "message": "Se envió un código a tu correo. Verifica para completar.",
                    "twoFactorRequired": True
                }), 200

            else:
                # 2) 2FA no requerido => login inmediato
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
                    logging.error(f"No se pudo actualizar last_access para user_id={user_id}")
                    return jsonify({"error": "Error al actualizar la última hora de acceso"}), 500

                conn.commit()

                # Generar un token JWT con expiración de 24 horas
                token = jwt.encode({
                    'user_id': user_id,
                    'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
                }, SECRET_KEY, algorithm="HS256")

                logging.info(f"Usuario {user_id} autenticado sin 2FA.")
                return jsonify({
                    "message": "Inicio de sesión exitoso",
                    "token": token,
                    "user_id": user_id,
                    "username": username,
                    "preferred_language": preferred_language,
                    "last_access": updated_row[0].isoformat() if updated_row[0] else None
                }), 200

        else:
            logging.warning(f"Contraseña incorrecta para {email}")
            return jsonify({"error": "Contraseña incorrecta"}), 401

    except Exception as e:
        conn.rollback()
        logging.error(f"Error en /login: {e}", exc_info=True)
        return jsonify({"error": "Error interno del servidor"}), 500

    finally:
        conn.close()


@auth_blueprint.route("/verify-2fa", methods=["POST"])
def verify_2fa():
    """
    Verifica el código de 2FA enviado al email. Emite un nuevo token JWT.
    """
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')

    if not email or not code:
        return jsonify({"error": "Email y código de verificación requeridos"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Obtener user_id, username desde la tabla 'users'
        cursor.execute("""
            SELECT user_id, username
            FROM users
            WHERE email = %s
        """, (email,))
        row = cursor.fetchone()
        if not row:
            return jsonify({"error": "Usuario no encontrado"}), 404

        user_id, username = row

        # Buscar el código en two_factor_codes (que no haya expirado)
        cursor.execute("""
            SELECT id, code, expires_at, attempts
            FROM two_factor_codes
            WHERE user_id = %s AND code = %s AND expires_at > %s
            ORDER BY created_at DESC
            LIMIT 1
        """, (user_id, code, datetime.datetime.now(datetime.timezone.utc)))
        code_row = cursor.fetchone()

        if not code_row:
            return jsonify({"error": "Código inválido o expirado"}), 400

        code_id, stored_code, expires_at, attempts = code_row

        if attempts >= 5:
            # Eliminar el código si superó intentos
            cursor.execute("DELETE FROM two_factor_codes WHERE id = %s", (code_id,))
            conn.commit()
            return jsonify({"error": "Número máximo de intentos alcanzado"}), 400

        if code != stored_code:
            cursor.execute("UPDATE two_factor_codes SET attempts = attempts + 1 WHERE id = %s", (code_id,))
            conn.commit()
            return jsonify({"error": "Código incorrecto"}), 400

        # Código correcto => borrarlo de la BD
        cursor.execute("DELETE FROM two_factor_codes WHERE id = %s", (code_id,))
        conn.commit()

        # Generar un nuevo token JWT de 24 horas
        token = jwt.encode({
            'user_id': user_id,
            'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
        }, SECRET_KEY, algorithm="HS256")

        logging.info(f"Usuario {user_id} (username='{username}') autenticado con 2FA.")
        return jsonify({
            "message": "2FA completado.",
            "token": token,
            "user_id": user_id,
            "username": username,
            "last_access": None
        }), 200

    except Exception as e:
        conn.rollback()
        logging.error(f"Error en /verify-2fa: {e}", exc_info=True)
        return jsonify({"error": "Error interno del servidor"}), 500

    finally:
        conn.close()


@auth_blueprint.route("/me", methods=["GET"])
@token_required
def get_current_user(current_user_id):
    """
    Retorna datos del usuario (tabla users y personal_details).
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT u.user_id, u.username, u.email, u.preferred_language,
                   p.full_name, p.student_id, p.alt_email, p.contact_number,
                   p.id_type, p.id_number, p.birth_date, p.country_of_residence,
                   u.account_status, p.last_access
            FROM users u
            LEFT JOIN personal_details p ON u.user_id = p.user_id
            WHERE u.user_id = %s;
        """, (current_user_id,))
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
            return jsonify({"error": "Usuario no encontrado"}), 404

    except Exception as e:
        logging.error(f"Error en /me: {e}", exc_info=True)
        return jsonify({"error": "Error interno del servidor", "details": str(e)}), 500

    finally:
        conn.close()


@auth_blueprint.route("/preferred-language", methods=["GET"])
@token_required
def get_preferred_language(current_user_id):
    """
    Retorna el idioma preferido del usuario autenticado desde la tabla 'users'.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT preferred_language 
            FROM users 
            WHERE user_id = %s;
        """, (current_user_id,))
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


@auth_blueprint.route("/preferred-language", methods=["PUT"])
@token_required
def update_preferred_language(current_user_id):
    """
    Actualiza el idioma preferido del usuario en la tabla 'users'.
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


@auth_blueprint.route("/users/<int:user_id>/email", methods=["PUT"])
@token_required
def update_user_email(current_user_id, user_id):
    """
    Actualiza el 'email' principal en la tabla 'users'.
    Verifica que el user_id == current_user_id antes de modificar.
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
        # Verificar que no exista un user con ese email
        cursor.execute("SELECT user_id FROM users WHERE email = %s", (new_email,))
        row = cursor.fetchone()
        if row:
            # Ya existe usuario con ese email
            return jsonify({"error": "Este correo ya está en uso"}), 409

        # Actualizar en la tabla 'users'
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
