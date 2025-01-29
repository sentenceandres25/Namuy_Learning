# app/routes/account_details.py

from flask import Blueprint, request, jsonify, current_app
from app.db.connection import get_db_connection
from app.utils.hash_utils import hash_password
from app.utils.validators import validate_user_data
import logging
import json
from werkzeug.utils import secure_filename
import os
from flask_mail import Message

from app.utils.decorators import token_required
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Inicializar el Blueprint para rutas relacionadas con detalles de cuenta
account_details_blueprint = Blueprint('account_details_blueprint', __name__, url_prefix='/api/account_details')

# Inicializar el Rate Limiter específicamente para este Blueprint
limiter = Limiter(
    key_func=get_remote_address
)

# Aplicar rate limiting a las rutas de este Blueprint
account_details_blueprint.before_request(limiter.check)


ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf'}


def allowed_file(filename):
    """
    Verifica si un nombre de archivo tiene una extensión permitida.
    (Se incluye por si en un futuro el "account details" necesita subir archivos)
    """
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def send_change_request_email(user_id, changes, doc_url):
    """
    Envía un correo al administrador indicando que hay cambios pendientes de aprobación.
    Incluye la URL local donde se subió el archivo (doc_url).
    """
    mail = current_app.extensions.get('mail')
    if not mail:
        logging.error("Flask-Mail no está configurado correctamente.")
        return

    msg = Message(
        subject="Nueva Solicitud de Cambio Pendiente de Aprobación",
        sender=current_app.config['MAIL_DEFAULT_SENDER'],
        recipients=["namuylearning@gmail.com"]  # Cambia al correo de tu admin
    )

    msg.body = f"""
    Hola,

    El usuario con ID {user_id} ha solicitado los siguientes cambios:
    {json.dumps(changes, indent=2)}

    Por favor, revisa el documento de identificación en el siguiente enlace:
    {doc_url}

    Saludos,
    Equipo de Namuylearning
    """

    try:
        mail.send(msg)
        logging.info(f"Correo enviado para la solicitud de cambio del usuario {user_id}.")
    except Exception as e:
        logging.error(f"Error al enviar el correo: {e}")


@account_details_blueprint.route("/<int:user_id>/updatePassword", methods=["PUT"])
@token_required
@limiter.limit("30 per hour")  # Limitar a 30 solicitudes por hora
def update_password(current_user_id, user_id):
    """
    Actualiza la contraseña de un usuario específico.
    Espera { "newPassword": "..." } en el body JSON.

    Args:
        current_user_id (int): El ID del usuario autenticado.
        user_id (int): El ID del usuario cuya contraseña se actualizará.

    Returns:
        JSON confirmando la actualización o un mensaje de error.
    """
    # Verificar que el usuario está actualizando su propia contraseña
    if current_user_id != user_id:
        logging.warning(f"Intento de actualización de contraseña no autorizado por user_id {current_user_id} para user_id {user_id}")
        return jsonify({"error": "Acceso no autorizado"}), 403

    if not request.is_json:
        return jsonify({"error": "Content-Type debe ser 'application/json'"}), 415
    
    data = request.get_json()
    new_password = data.get('newPassword')
    if not new_password:
        return jsonify({"error": "No se proporcionó la nueva contraseña"}), 400

    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            # Hashear la nueva contraseña con bcrypt
            hashed_bytes = hash_password(new_password)
            hashed_str = hashed_bytes.decode('utf-8')

            cursor.execute("""
                UPDATE users
                SET password_hash = %s
                WHERE user_id = %s
                RETURNING user_id;
            """, (hashed_str, user_id))
            updated = cursor.fetchone()
            if not updated:
                return jsonify({"error": "Usuario no encontrado"}), 404

            conn.commit()
            return jsonify({"message": "Contraseña actualizada exitosamente"}), 200

    except Exception as e:
        logging.error(f"Error al actualizar contraseña user_id {user_id}: {e}", exc_info=True)
        return jsonify({"error": "Error interno del servidor"}), 500
