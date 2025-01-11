# app/auth/decorators.py

from functools import wraps
from flask import request, jsonify, current_app
import jwt
from app.models import Users  # <-- En lugar de PersonalDetails
from app.extensions import db

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Verificar encabezado Authorization
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            parts = auth_header.split()
            if len(parts) == 2 and parts[0] == 'Bearer':
                token = parts[1]

        if not token:
            return jsonify({'error': 'Token de autorización faltante'}), 401

        try:
            # Si el token llegara como bytes, decodificarlo
            if isinstance(token, bytes):
                token = token.decode('utf-8')

            # Obtener la clave secreta
            secret_key = current_app.config.get('JWT_SECRET_KEY', 'tu_clave_secreta_jwt')

            # Decodificar el token
            data = jwt.decode(token, secret_key, algorithms=["HS256"])
            user_id = data.get('user_id')
            if not user_id:
                return jsonify({'error': 'Token inválido: falta user_id'}), 401

            # Buscar el usuario en la tabla users
            user = Users.query.filter_by(user_id=user_id).first()
            if not user:
                return jsonify({'error': 'Usuario no encontrado'}), 401

        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token inválido'}), 401
        except Exception as e:
            # Manejo genérico de excepciones
            print(f"Excepción en token_required: {e}")
            return jsonify({'error': 'Error al procesar el token'}), 500

        # Pasar el usuario al endpoint decorado
        return f(user, *args, **kwargs)

    return decorated
