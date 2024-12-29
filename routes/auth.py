from flask import Blueprint, request, jsonify
import jwt
from functools import wraps
from db.connection import get_db_connection
from utils.hash_utils import check_password
import os
import datetime
import logging

auth_blueprint = Blueprint('auth', __name__)

# Cargar la clave secreta desde las variables de entorno
SECRET_KEY = os.getenv('SECRET_KEY')
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY no está configurada en el .env")

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
    Retorna un token JWT si es correcto.
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
        cursor.execute("SELECT user_id, username, password_hash FROM users WHERE email = %s", (email,))
        row = cursor.fetchone()
        if not row:
            logging.warning(f"Usuario no encontrado para el email: {email}")
            return jsonify({"error": "Usuario no encontrado"}), 404

        user_id, username, password_hash_str = row
        logging.info(f"DEBUG en /login -> user_id={user_id}, username={username}, password_hash={password_hash_str}")

        # password_hash_str es un string: '$2b$12$abc123...'
        # Verificar con check_password
        if check_password(password, password_hash_str):
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
                "username": username
            }), 200
        else:
            logging.warning(f"Contraseña incorrecta para el email: {email}")
            return jsonify({"error": "Contraseña incorrecta"}), 401

    except Exception as e:
        logging.error(f"Error en /login: {e}", exc_info=True)
        return jsonify({"error": "Error interno del servidor"}), 500
    finally:
        conn.close()

@auth_blueprint.route("/me", methods=["GET"])
@token_required
def get_current_user(current_user_id):
    """
    Retorna datos del usuario (tabla users y personal_details) para el usuario logueado.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT u.user_id, u.username, u.email,
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
                "full_name": row[3],
                "student_id": row[4],
                "alt_email": row[5],
                "contact_number": row[6],
                "id_type": row[7],
                "id_number": row[8],
                "birth_date": row[9].isoformat() if row[9] else None,
                "country_of_residence": row[10],
                "account_status": row[11],  # Ej: 'Active', 'Inactive', etc.
                "last_access": row[12].isoformat() if row[12] else None
            }
            return jsonify({"user": user_data}), 200
        else:
            return jsonify({"error": "Usuario no encontrado"}), 404

    except Exception as e:
        logging.error(f"Error en /me: {e}", exc_info=True)
        return jsonify({"error": "Error interno del servidor", "details": str(e)}), 500
    finally:
        conn.close()
