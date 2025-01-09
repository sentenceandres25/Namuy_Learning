# utils/decorators.py

from functools import wraps
from flask import request, jsonify
import jwt
import os
import logging

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
            # Usar JWT_SECRET_KEY en lugar de SECRET_KEY
            SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'tu_clave_secreta_jwt')
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
