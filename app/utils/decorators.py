# app/utils/decorators.py

from functools import wraps
from flask import request, jsonify, g
import jwt
import os
import logging
from app.models.user_models import Users
from app.extensions import db  # Asegúrate de que 'db' está correctamente importado desde extensions.py

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Obtener el token desde los encabezados de la solicitud
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            parts = auth_header.split()
            if len(parts) == 2 and parts[0] == 'Bearer':
                token = parts[1]

        if not token:
            return jsonify({'error': 'Token de autorización faltante'}), 401

        try:
            # Decodificar el token usando la clave secreta
            SECRET_KEY = os.getenv('JWT_SECRET_KEY')
            if not SECRET_KEY:
                logging.error("JWT_SECRET_KEY no está configurado en las variables de entorno.")
                return jsonify({'error': 'Configuración del servidor incorrecta.'}), 500

            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            user_id = data.get('user_id')

            if not user_id:
                return jsonify({'error': 'Token inválido: falta user_id'}), 401

            # Recuperar el objeto de usuario desde la base de datos
            current_user = Users.query.get(user_id)
            if not current_user:
                return jsonify({'error': 'Usuario no encontrado'}), 401

            # Añadir el objeto de usuario al contexto global de Flask
            g.current_user = current_user

        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token inválido'}), 401
        except Exception as e:
            logging.error(f"Error al decodificar el token: {e}", exc_info=True)
            return jsonify({'error': 'Error interno del servidor'}), 500

        # Continuar con la ejecución de la función de ruta, pasando el user_id como antes
        return f(user_id, *args, **kwargs)
    return decorated
