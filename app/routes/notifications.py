# notifications.py

from flask import Blueprint, request, jsonify
from db.connection import get_db_connection
import logging

from utils.decorators import token_required  # Importar el decorador común

notifications_blueprint = Blueprint('notifications_blueprint', __name__)

@notifications_blueprint.route("/preferences", methods=["GET"])
@token_required
def get_notification_preferences(current_user_id):
    """
    Retorna las preferencias de notificación del usuario autenticado.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT email, sms, whatsapp
            FROM notification_preferences
            WHERE user_id = %s;
        """, (current_user_id,))
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
        logging.error(f"Error en GET /notifications/preferences: {e}", exc_info=True)
        return jsonify({"error": "Error interno del servidor"}), 500
    finally:
        conn.close()

@notifications_blueprint.route("/preferences", methods=["PUT"])
@token_required
def update_notification_preferences(current_user_id):
    """
    Actualiza las preferencias de notificación del usuario autenticado.
    Espera un JSON con las claves 'email', 'sms' y 'whatsapp'.
    """
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
        """, (email, sms, whatsapp, current_user_id))
        row = cursor.fetchone()

        if row:
            conn.commit()
            updated_preferences = {
                "email": row[0],
                "sms": row[1],
                "whatsapp": row[2]
            }
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
            """, (current_user_id, email, sms, whatsapp))
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
        logging.error(f"Error en PUT /notifications/preferences: {e}", exc_info=True)
        return jsonify({"error": "Error interno del servidor"}), 500
    finally:
        conn.close()
