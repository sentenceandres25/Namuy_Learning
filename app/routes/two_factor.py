# app/routes/two_factor.py

from flask import Blueprint, request, jsonify
from app.auth.decorators import token_required
from app.models import TwoFactorCode, Users
from app.extensions import db
from app.two_factor.utils import generate_verification_code, send_verification_email
from datetime import datetime, timedelta
import logging

two_factor_bp = Blueprint('two_factor', __name__)

logging.basicConfig(filename='error.log', level=logging.ERROR)

@two_factor_bp.route('/preferences', methods=['GET'])
@token_required
def get_2fa_preferences(current_user):
    """
    Retorna si 2FA está habilitado y el correo electrónico registrado (users.email).
    """
    return jsonify({
        'twoFactorEnabled': current_user.two_factor_enabled,
        'email': current_user.email if current_user.email else ''
    }), 200

@two_factor_bp.route('/preferences', methods=['PUT'])
@token_required
def update_2fa_preferences(current_user):
    """
    Permite habilitar/deshabilitar 2FA y actualizar el correo electrónico.
    Envía un código de verificación al correo electrónico proporcionado si se habilita.
    """
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Datos requeridos'}), 400

    two_factor_enabled = data.get('twoFactorEnabled')
    email = data.get('email')

    if two_factor_enabled:
        # Habilitar 2FA
        if not email:
            return jsonify({'error': 'Correo electrónico requerido para habilitar 2FA'}), 400

        # Actualizar users.email
        current_user.email = email

        # Generar y enviar código por email
        code = generate_verification_code()
        try:
            send_verification_email(current_user.email, code)
        except Exception as e:
            logging.error(f"Error al enviar email: {e}")
            return jsonify({'error': 'Error al enviar el correo de verificación'}), 500

        # Guardar en two_factor_codes
        two_factor_code = TwoFactorCode(
            user_id=current_user.user_id,
            code=code,
            expires_at=datetime.utcnow() + timedelta(minutes=10)
        )
        db.session.add(two_factor_code)

        # Marcar two_factor_enabled = True en la tabla users
        current_user.two_factor_enabled = True
        db.session.commit()

        return jsonify({'message': 'Código enviado. Verifica para habilitar 2FA.'}), 200

    else:
        # Deshabilitar 2FA
        current_user.two_factor_enabled = False
        # En caso de que quieras limpiar el email en users:
        db.session.commit()
        return jsonify({'message': '2FA deshabilitado correctamente.'}), 200


@two_factor_bp.route('/send-code', methods=['POST'])
@token_required
def send_2fa_code(current_user):
    """
    Envía un código de verificación al correo electrónico (users.email).
    """
    data = request.get_json()
    if not data or not data.get('email'):
        return jsonify({'error': 'Correo electrónico requerido'}), 400

    email = data['email']
    if not email:
        return jsonify({'error': 'No se ha especificado un correo electrónico'}), 400

    # Enviar código
    code = generate_verification_code()
    try:
        send_verification_email(email, code)
    except Exception as e:
        logging.error(f"Error al enviar email: {e}")
        return jsonify({'error': 'Error al enviar el correo de verificación'}), 500

    # Guardar en la DB
    two_factor_code = TwoFactorCode(
        user_id=current_user.user_id,
        code=code,
        expires_at=datetime.utcnow() + timedelta(minutes=10)
    )
    db.session.add(two_factor_code)
    db.session.commit()

    return jsonify({'message': 'Código de verificación enviado con éxito.'}), 200


@two_factor_bp.route('/verify', methods=['POST'])
@token_required
def verify_2fa_code(current_user):
    """
    Verifica el código para completar la habilitación de 2FA.
    """
    data = request.get_json()
    if not data or not data.get('code'):
        return jsonify({'error': 'Código requerido'}), 400

    code = data['code']

    # Buscar el code
    two_factor_code = TwoFactorCode.query.filter_by(user_id=current_user.user_id, code=code).first()
    if not two_factor_code:
        return jsonify({'error': 'Código inválido'}), 400

    if two_factor_code.is_expired():
        db.session.delete(two_factor_code)
        db.session.commit()
        return jsonify({'error': 'Código expirado'}), 400

    if two_factor_code.attempts >= 5:
        db.session.delete(two_factor_code)
        db.session.commit()
        return jsonify({'error': 'Máximo de intentos alcanzado'}), 400

    # Aumentar intentos
    two_factor_code.increment_attempts()
    db.session.commit()

    # Marcar en users que 2FA está habilitado
    current_user.two_factor_enabled = True
    db.session.commit()

    # Borrar el código
    db.session.delete(two_factor_code)
    db.session.commit()

    return jsonify({'message': '2FA habilitado con éxito.'}), 200
