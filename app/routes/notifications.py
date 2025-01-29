# app/routes/notifications.py

from flask import Blueprint, request, jsonify
from app.db.connection import get_db_connection
import logging

from app.utils.decorators import token_required  # Importar el decorador común
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Initialize the Blueprint for notification-related routes
notifications_blueprint = Blueprint('notifications_blueprint', __name__, url_prefix='/api/notifications')

# Initialize the Rate Limiter specifically for this Blueprint
limiter = Limiter(
    key_func=get_remote_address
)

# Apply rate limiting to the Blueprint
notifications_blueprint.before_request(limiter.check)


@notifications_blueprint.route("/preferences", methods=["GET"])
@token_required
@limiter.limit("100 per hour")  # Ejemplo: Limitar a 100 solicitudes por hora
def get_notification_preferences(user_id):
    """
    Retorna las preferencias de notificación del usuario autenticado.
    
    Args:
        user_id (int): El ID del usuario autenticado, proporcionado por el decorador token_required.
    
    Returns:
        JSON con las preferencias de notificación, o un mensaje de error.
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
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
        logging.error(f"Error en GET /notifications/preferences para user_id={user_id}: {e}", exc_info=True)
        return jsonify({"error": "Error interno del servidor"}), 500


@notifications_blueprint.route("/preferences", methods=["PUT"])
@token_required
@limiter.limit("50 per hour")  # Ejemplo: Limitar a 50 solicitudes por hora
def update_notification_preferences(user_id):
    """
    Actualiza las preferencias de notificación del usuario autenticado.
    Espera un JSON con las claves 'email', 'sms' y 'whatsapp'.
    
    Args:
        user_id (int): El ID del usuario autenticado, proporcionado por el decorador token_required.
    
    Returns:
        JSON confirmando la actualización o un mensaje de error.
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

    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            # Intentar actualizar las preferencias existentes
            cursor.execute("""
                UPDATE notification_preferences
                SET email = %s, sms = %s, whatsapp = %s
                WHERE user_id = %s
                RETURNING email, sms, whatsapp;
            """, (email, sms, whatsapp, user_id))
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
                    INSERT INTO notification_preferences (user_id, email, sms, whatsapp, created_at)
                    VALUES (%s, %s, %s, %s, NOW())
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
        logging.error(f"Error en PUT /notifications/preferences para user_id={user_id}: {e}", exc_info=True)
        return jsonify({"error": "Error interno del servidor"}), 500


@notifications_blueprint.route("/preferences/<int:user_id>/email", methods=["PUT"])
@token_required
@limiter.limit("30 per hour")  # Ejemplo: Limitar a 30 solicitudes por hora
def update_user_email_notifications(current_user_id, user_id):
    """
    Actualiza las preferencias de notificación por email del usuario autenticado.
    
    Args:
        current_user_id (int): El ID del usuario autenticado, proporcionado por el decorador token_required.
        user_id (int): El ID del usuario cuyo email de notificación se actualizará.
    
    Returns:
        JSON confirmando la actualización o un mensaje de error.
    """
    # Verificar que el usuario está actualizando sus propias preferencias
    if current_user_id != user_id:
        logging.warning(f"Intento de actualización no autorizado por user_id={current_user_id} para user_id={user_id}")
        return jsonify({"error": "Acceso no autorizado"}), 403

    data = request.get_json()
    if not data or 'emailNotifications' not in data:
        return jsonify({"error": "Se requiere el campo 'emailNotifications'"}), 400

    email_notifications = data['emailNotifications']

    # Validar que el campo sea booleano
    if not isinstance(email_notifications, bool):
        return jsonify({"error": "El campo 'emailNotifications' debe ser booleano"}), 400

    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            # Actualizar las preferencias de notificación por email
            cursor.execute("""
                UPDATE notification_preferences
                SET email = %s,
                    updated_at = NOW()
                WHERE user_id = %s
                RETURNING email, sms, whatsapp;
            """, (email_notifications, user_id))
            
            if cursor.rowcount == 0:
                # Si no existe un registro, crear uno
                cursor.execute("""
                    INSERT INTO notification_preferences (user_id, email, sms, whatsapp, created_at)
                    VALUES (%s, %s, %s, %s, NOW())
                    RETURNING email, sms, whatsapp;
                """, (user_id, email_notifications, False, False))  # Asumimos que sms y whatsapp son False por defecto
                row = cursor.fetchone()
                conn.commit()
                updated_preferences = {
                    "email": row[0],
                    "sms": row[1],
                    "whatsapp": row[2]
                }
                return jsonify({
                    "message": "Preferencias de notificación por email creadas exitosamente",
                    "preferences": updated_preferences
                }), 201

            # Recuperar las preferencias actualizadas
            row = cursor.fetchone()
            updated_preferences = {
                "email": row[0],
                "sms": row[1],
                "whatsapp": row[2]
            }
            conn.commit()
            return jsonify({
                "message": "Preferencias de notificación por email actualizadas exitosamente",
                "preferences": updated_preferences
            }), 200

    except Exception as e:
        logging.error(f"Error en PUT /notifications/preferences/{user_id}/email para user_id={user_id}: {e}", exc_info=True)
        return jsonify({"error": "Error interno del servidor"}), 500
