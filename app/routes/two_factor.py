# app/routes/two_factor.py

from flask import Blueprint, request, jsonify, g
from app.utils.decorators import token_required
from app.extensions import db
from app.models.user_models import TwoFactorCode, Users
from app.config import Config
from datetime import datetime, timedelta
import logging
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from app.utils.email_utils import generate_verification_code, send_verification_email_async, send_verification_sms_async
from app.utils.validators import validate_email, validate_phone_number  # Asegúrate de tener funciones de validación

# Inicializar el Blueprint para las rutas de dos factores
two_factor_bp = Blueprint('two_factor', __name__)

# Inicializar el Rate Limiter específicamente para este Blueprint
limiter = Limiter(
    key_func=get_remote_address
)

# Aplicar rate limiting al Blueprint
two_factor_bp.before_request(limiter.check)

@two_factor_bp.route('/preferences', methods=['GET'])
@token_required
@limiter.limit("100 per hour")  # Ejemplo: Limitar a 100 solicitudes por hora
def get_2fa_preferences(user_id):
    """
    Recupera si 2FA está habilitado y la dirección de correo electrónico registrada para el usuario autenticado.
    """
    # Obtener el objeto current_user desde flask.g
    current_user = g.get('current_user')
    if not current_user:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    response = {
        'twoFactorEnabled': current_user.two_factor_enabled,
        'email': current_user.email if current_user.email else ''
    }
    return jsonify(response), 200

@two_factor_bp.route('/preferences', methods=['PUT'])
@token_required
@limiter.limit("50 per hour")  # Ejemplo: Limitar a 50 solicitudes por hora
def update_2fa_preferences(user_id):
    """
    Habilita o deshabilita 2FA y actualiza la dirección de correo electrónico del usuario.
    Envía un código de verificación al correo electrónico proporcionado si se está habilitando 2FA.
    """
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Se requiere datos'}), 400

    two_factor_enabled = data.get('twoFactorEnabled')
    email = data.get('email')

    try:
        # Obtener el objeto current_user desde flask.g
        current_user = g.get('current_user')
        if not current_user:
            return jsonify({'error': 'Usuario no encontrado'}), 404

        if two_factor_enabled:
            # Habilitar 2FA
            if not email:
                return jsonify({'error': 'Se requiere correo electrónico para habilitar 2FA'}), 400

            if not validate_email(email):
                return jsonify({'error': 'Formato de correo electrónico inválido'}), 400

            # Actualizar el correo electrónico del usuario
            current_user.email = email

            # Generar código de verificación
            code = generate_verification_code()

            # Enviar correo electrónico de verificación de forma asíncrona
            send_verification_email_async(current_user.user_id, code)

            # Guardar el código de verificación en la base de datos
            expires_at = datetime.utcnow() + timedelta(minutes=Config.TWO_FACTOR_CODE_EXPIRY_MINUTES)
            new_code = TwoFactorCode(
                user_id=current_user.user_id,
                code=code,
                method='email',
                expires_at=expires_at
            )
            db.session.add(new_code)

            # Marcar 2FA como habilitado
            current_user.two_factor_enabled = True
            db.session.commit()

            return jsonify({'message': 'Código de verificación enviado. Por favor, verifica para habilitar 2FA.'}), 200

        else:
            # Deshabilitar 2FA
            current_user.two_factor_enabled = False
            db.session.commit()
            return jsonify({'message': '2FA ha sido deshabilitado exitosamente.'}), 200

    except Exception as e:
        logging.error(f"Error al actualizar preferencias de 2FA: {e}", exc_info=True)
        db.session.rollback()
        return jsonify({'error': 'Error interno del servidor'}), 500

@two_factor_bp.route('/send-code', methods=['POST'])
@token_required
@limiter.limit("30 per hour")  # Ejemplo: Limitar a 30 solicitudes por hora
def send_2fa_code(user_id):
    """
    Envía un código de verificación a la dirección de correo electrónico del usuario.
    """
    data = request.get_json()
    if not data or not data.get('email'):
        return jsonify({'error': 'Se requiere correo electrónico'}), 400

    email = data['email']
    if not email:
        return jsonify({'error': 'No se especificó correo electrónico'}), 400

    if not validate_email(email):
        return jsonify({'error': 'Formato de correo electrónico inválido'}), 400

    try:
        # Obtener el objeto current_user desde flask.g
        current_user = g.get('current_user')
        if not current_user:
            return jsonify({'error': 'Usuario no encontrado'}), 404

        # Generar código de verificación
        code = generate_verification_code()

        # Enviar correo electrónico de verificación de forma asíncrona
        send_verification_email_async(current_user.user_id, code)

        # Guardar el código de verificación en la base de datos
        expires_at = datetime.utcnow() + timedelta(minutes=Config.TWO_FACTOR_CODE_EXPIRY_MINUTES)
        new_code = TwoFactorCode(
            user_id=current_user.user_id,
            code=code,
            method='email',
            expires_at=expires_at
        )
        db.session.add(new_code)
        db.session.commit()

        return jsonify({'message': 'Código de verificación enviado exitosamente.'}), 200

    except Exception as e:
        logging.error(f"Error al enviar código de 2FA: {e}", exc_info=True)
        db.session.rollback()
        return jsonify({'error': 'No se pudo enviar el correo de verificación'}), 500

@two_factor_bp.route('/verify', methods=['POST'])
@token_required
@limiter.limit("20 per hour")  # Ejemplo: Limitar a 20 solicitudes por hora
def verify_2fa_code(user_id):
    """
    Verifica el código 2FA proporcionado para completar la habilitación de 2FA.
    """
    data = request.get_json()
    if not data or not data.get('code'):
        return jsonify({'error': 'Se requiere código'}), 400

    code = data['code']

    try:
        # Obtener el objeto current_user desde flask.g
        current_user = g.get('current_user')
        if not current_user:
            return jsonify({'error': 'Usuario no encontrado'}), 404

        # Recuperar el código de la base de datos
        verification_code = TwoFactorCode.query.filter_by(user_id=current_user.user_id, code=code).first()

        if not verification_code:
            return jsonify({'error': 'Código inválido'}), 400

        if verification_code.is_expired():
            db.session.delete(verification_code)
            db.session.commit()
            return jsonify({'error': 'El código ha expirado'}), 400

        if verification_code.attempts >= Config.TWO_FACTOR_MAX_ATTEMPTS:
            db.session.delete(verification_code)
            db.session.commit()
            return jsonify({'error': 'Se alcanzó el número máximo de intentos'}), 400

        # Incrementar el número de intentos
        verification_code.increment_attempts()
        db.session.commit()

        # Marcar 2FA como habilitado en la tabla de usuarios
        current_user.two_factor_enabled = True
        db.session.commit()

        # Eliminar el código utilizado
        db.session.delete(verification_code)
        db.session.commit()

        return jsonify({'message': '2FA ha sido habilitado exitosamente.'}), 200

    except Exception as e:
        logging.error(f"Error al verificar código de 2FA: {e}", exc_info=True)
        db.session.rollback()
        return jsonify({'error': 'Error interno del servidor'}), 500
