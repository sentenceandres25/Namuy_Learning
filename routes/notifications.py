# notifications.py

from flask import Blueprint, request, jsonify
import jwt
from functools import wraps
from db.connection import get_db_connection
import os
import logging

notifications_blueprint = Blueprint('notifications', __name__)

# Cargar la clave secreta desde las variables de entorno
SECRET_KEY = os.getenv('SECRET_KEY')
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY no está configurada en las variables de entorno.")

# Configurar logging para errores
logging.basicConfig(filename='error.log', level=logging.ERROR)

def token_required(f):
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

@notifications_blueprint.route("/preferences/<int:user_id>", methods=["GET"])
@token_required
def get_notification_preferences(current_user_id, user_id):
    """
    Retorna las preferencias de notificación del usuario autenticado.
    """
    if current_user_id != user_id:
        return jsonify({"error": "Acceso no autorizado"}), 403

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT email, sms, whatsapp
            FROM notification_preferences
            WHERE user_id = %s;
        """, (user_id,))
        row = cursor.fetchone()

        if row:
            preferences = {
                "email": row[0],
                "sms": row[1],
                "whatsapp": row[2]
            }
            return jsonify({"preferences": preferences}), 200
        else:
            return jsonify({"error": "Preferencias de notificación no encontradas"}), 404

    except Exception as e:
        logging.error(f"Error en GET /notifications/preferences/{user_id}: {e}", exc_info=True)
        return jsonify({"error": "Error interno del servidor"}), 500
    finally:
        conn.close()

@notifications_blueprint.route("/preferences/<int:user_id>", methods=["PUT"])
@token_required
def update_notification_preferences(current_user_id, user_id):
    """
    Actualiza las preferencias de notificación del usuario autenticado.
    Espera un JSON con las claves 'email', 'sms' y 'whatsapp'.
    """
    if current_user_id != user_id:
        return jsonify({"error": "Acceso no autorizado"}), 403

    data = request.get_json()
    if not data or 'preferences' not in data:
        return jsonify({"error": "Datos de preferencia requeridos"}), 400

    # Extraer preferencias
    preferences = data.get('preferences', {})
    email = preferences.get('email')
    sms = preferences.get('sms')
    whatsapp = preferences.get('whatsapp')

    # Validar que los valores sean booleanos
    if not isinstance(email, bool) or not isinstance(sms, bool) or not isinstance(whatsapp, bool):
        return jsonify({"error": "Las preferencias deben ser valores booleanos"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Intentar actualizar las preferencias existentes
        cursor.execute("""
            UPDATE notification_preferences
            SET email = %s, sms = %s, whatsapp = %s
            WHERE user_id = %s
            RETURNING email, sms, whatsapp;
        """, (email, sms, whatsapp, user_id))
        row = cursor.fetchone()

        if row:
            updated_preferences = {
                "email": row[0],
                "sms": row[1],
                "whatsapp": row[2]
            }
            conn.commit()
            return jsonify({
                "message": "Preferencias de notificación actualizadas exitosamente",
                "preferences": updated_preferences
            }), 200
        else:
            # Si no existe una entrada, insertar una nueva
            cursor.execute("""
                INSERT INTO notification_preferences (user_id, email, sms, whatsapp)
                VALUES (%s, %s, %s, %s)
                RETURNING email, sms, whatsapp;
            """, (user_id, email, sms, whatsapp))
            row = cursor.fetchone()
            conn.commit()
            updated_preferences = {
                "email": row[0],
                "sms": row[1],
                "whatsapp": row[2]
            }
            return jsonify({
                "message": "Preferencias de notificación creadas exitosamente",
                "preferences": updated_preferences
            }), 201

    except Exception as e:
        conn.rollback()
        logging.error(f"Error en PUT /notifications/preferences/{user_id}: {e}", exc_info=True)
        return jsonify({"error": "Error interno del servidor"}), 500
    finally:
        conn.close()
