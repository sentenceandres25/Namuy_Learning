# app/routes/two_factor.py

from flask import Blueprint, request, jsonify
from app.auth.decorators import token_required
from app.models import TwoFactorCode, Users
from app.extensions import db
from app.two_factor.utils import generate_verification_code, send_verification_email, send_verification_sms
from datetime import datetime, timedelta
import logging

two_factor_bp = Blueprint('two_factor', __name__)

# Configurar logging para errores y depuración
logging.basicConfig(filename='error.log', level=logging.ERROR)

@two_factor_bp.route('/preferences', methods=['GET'])
@token_required
def get_2fa_preferences(current_user):
    """
    Retorna si 2FA está habilitado y el método de contacto registrado.
    """
    return jsonify({
        'twoFactorEnabled': current_user.two_factor_enabled,
        'method': current_user.method if current_user.method else '',
        'email': current_user.email if current_user.email else '',
        'contactNumber': current_user.contact_number if current_user.contact_number else ''
    }), 200

@two_factor_bp.route('/preferences', methods=['PUT'])
@token_required
def update_2fa_preferences(current_user):
    """
    Permite habilitar/deshabilitar 2FA y actualizar el método de contacto.
    Envía códigos de verificación al método de contacto seleccionado.
    """
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Datos requeridos'}), 400

    two_factor_enabled = data.get('twoFactorEnabled')
    method = data.get('method')  # 'email' o 'sms'

    if two_factor_enabled:
        if not method or method not in ['email', 'sms']:
            return jsonify({'error': 'Método de contacto requerido y debe ser válido'}), 400

        # Actualizar métodos de contacto según el método seleccionado
        if method == 'email':
            email = data.get('email')
            if not email:
                return jsonify({'error': 'Correo electrónico requerido para método email'}), 400
            current_user.email = email
            current_user.contact_number = ''  # Limpiar número de teléfono si se elige email

            # Generar y enviar código de verificación por email
            code = generate_verification_code()
            send_verification_email(current_user.email, code)

            # Guardar el código en la base de datos
            two_factor_code = TwoFactorCode(
                user_id=current_user.user_id,
                code=code,
                method='email',
                expires_at=datetime.utcnow() + timedelta(minutes=10)
            )
            db.session.add(two_factor_code)

        elif method == 'sms':
            contact_number = data.get('contactNumber')
            if not contact_number:
                return jsonify({'error': 'Número de teléfono requerido para método sms'}), 400
            current_user.contact_number = contact_number
            current_user.email = ''  # Limpiar email si se elige sms

            # Generar y enviar código de verificación por sms
            code = generate_verification_code()
            send_verification_sms(current_user.contact_number, code)

            # Guardar el código en la base de datos
            two_factor_code = TwoFactorCode(
                user_id=current_user.user_id,
                code=code,
                method='sms',
                expires_at=datetime.utcnow() + timedelta(minutes=10)
            )
            db.session.add(two_factor_code)

        # Establecer el método de contacto
        current_user.method = method

        # Habilitar 2FA
        current_user.two_factor_enabled = True
        db.session.commit()

        return jsonify({'message': 'Códigos de verificación enviados. Por favor, verifica para habilitar 2FA.'}), 200

    else:
        # Deshabilitar 2FA
        current_user.two_factor_enabled = False
        current_user.method = ''
        current_user.email = ''
        current_user.contact_number = ''
        db.session.commit()
        return jsonify({'message': 'Autenticación de Dos Factores deshabilitada exitosamente.'}), 200

@two_factor_bp.route('/send-code', methods=['POST'])
@token_required
def send_2fa_code(current_user):
    """
    Envía un código de verificación al método de contacto seleccionado.
    """
    data = request.get_json()
    if not data or not data.get('method'):
        return jsonify({'error': 'Método de contacto requerido'}), 400

    method = data['method']
    if method not in ['email', 'sms']:
        return jsonify({'error': 'Método de contacto inválido'}), 400

    if method == 'email':
        if not current_user.email:
            return jsonify({'error': 'No se ha registrado un correo electrónico'}), 400
        code = generate_verification_code()
        send_verification_email(current_user.email, code)
    elif method == 'sms':
        if not current_user.contact_number:
            return jsonify({'error': 'No se ha registrado un número de teléfono'}), 400
        code = generate_verification_code()
        send_verification_sms(current_user.contact_number, code)

    # Guardar el código en la base de datos
    two_factor_code = TwoFactorCode(
        user_id=current_user.user_id,
        code=code,
        method=method,
        expires_at=datetime.utcnow() + timedelta(minutes=10)
    )
    db.session.add(two_factor_code)
    db.session.commit()

    return jsonify({'message': 'Código de verificación enviado exitosamente.'}), 200

@two_factor_bp.route('/verify', methods=['POST'])
@token_required
def verify_2fa_code(current_user):
    """
    Verifica el código enviado al usuario para confirmar la habilitación de 2FA.
    """
    data = request.get_json()
    if not data or not data.get('code') or not data.get('method'):
        return jsonify({'error': 'Código y método de contacto requeridos'}), 400

    code = data['code']
    method = data['method']

    if method not in ['email', 'sms']:
        return jsonify({'error': 'Método de contacto inválido'}), 400

    # Buscar el código de verificación
    two_factor_code = TwoFactorCode.query.filter_by(user_id=current_user.user_id, code=code, method=method).first()

    if not two_factor_code:
        return jsonify({'error': 'Código de verificación inválido'}), 400

    if two_factor_code.is_expired():
        db.session.delete(two_factor_code)
        db.session.commit()
        return jsonify({'error': 'Código de verificación expirado'}), 400

    if two_factor_code.attempts >= 5:
        db.session.delete(two_factor_code)
        db.session.commit()
        return jsonify({'error': 'Número máximo de intentos alcanzado'}), 400

    # Incrementar el contador de intentos
    two_factor_code.increment_attempts()
    db.session.commit()

    # Habilitar 2FA si el código es válido
    current_user.two_factor_enabled = True
    current_user.method = method
    db.session.commit()

    # Eliminar el código después de la verificación
    db.session.delete(two_factor_code)
    db.session.commit()

    return jsonify({'message': 'Autenticación de Dos Factores habilitada exitosamente.'}), 200
