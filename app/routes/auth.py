# app/routes/auth.py

from flask import Blueprint, request, jsonify
import jwt
from functools import wraps
from db.connection import get_db_connection
from utils.hash_utils import check_password
import os
import datetime
import logging

auth_blueprint = Blueprint('auth_blueprint', __name__)

# Cargar la clave secreta desde las variables de entorno
SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'tu_clave_secreta_jwt')
if not SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY no está configurada en el .env")

# Configurar logging para errores
logging.basicConfig(filename='error.log', level=logging.ERROR)

def token_required(f):
    """
    Decorador para verificar que se incluya un Bearer token válido en el header Authorization.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            parts = auth_header.split()
            if len(parts) == 2 and parts[0] == 'Bearer':
                token = parts[1]
        if not token:
            return jsonify({'error': 'Token de autorización faltante'}), 401
        try:
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
    Inicia sesión validando el email y la contraseña con bcrypt.
    Retorna un token JWT y actualiza last_access si es correcto.
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
        cursor.execute("SELECT user_id, username, password_hash, preferred_language FROM users WHERE email = %s", (email,))
        row = cursor.fetchone()
        if not row:
            logging.warning(f"Usuario no encontrado para el email: {email}")
            return jsonify({"error": "Usuario no encontrado"}), 404

        user_id, username, password_hash_str, preferred_language = row
        logging.info(f"DEBUG en /login -> user_id={user_id}, username={username}, password_hash={password_hash_str}, preferred_language={preferred_language}")

        # Verificar la contraseña
        if check_password(password, password_hash_str):
            # Actualizar last_access en personal_details con hora UTC
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
                logging.error(f"No se pudo actualizar last_access para user_id {user_id}")
                return jsonify({"error": "Error al actualizar la última hora de acceso"}), 500

            conn.commit()

            # Generar JWT
            token = jwt.encode({
                'user_id': user_id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, SECRET_KEY, algorithm="HS256")

            logging.info(f"Usuario {user_id} autenticado con éxito.")

            return jsonify({
                "message": "Inicio de sesión exitoso",
                "token": token,
                "user_id": user_id,
                "username": username,
                "preferred_language": preferred_language,  # Incluir preferred_language en la respuesta de login
                "last_access": updated_row[0].isoformat() if updated_row[0] else None
            }), 200
        else:
            logging.warning(f"Contraseña incorrecta para el email: {email}")
            return jsonify({"error": "Contraseña incorrecta"}), 401

    except Exception as e:
        conn.rollback()
        logging.error(f"Error en /login: {e}", exc_info=True)
        return jsonify({"error": "Error interno del servidor"}), 500
    finally:
        conn.close()

@auth_blueprint.route("/me", methods=["GET"])
@token_required
def get_current_user(current_user_id):
    """
    Retorna datos del usuario (tabla users y personal_details) para el usuario logueado.
    Incluye preferred_language.
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
                "account_status": row[12],  # Ej: 'Active', 'Inactive', etc.
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

@auth_blueprint.route("/preferred-language", methods=["PUT"])
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
