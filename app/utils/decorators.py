# app/utils/decorators.py

from functools import wraps
from flask import request, jsonify, g
import jwt
import os
import logging
from app.models.user_models import Users
from app.db.connection import get_db_connection

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Obtener el token desde los encabezados de la solicitud
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            parts = auth_header.split()
            if len(parts) == 2 and parts[0].lower() == 'bearer':
                token = parts[1]

        if not token:
            logging.warning("Missing authorization token.")
            return jsonify({'error': 'Authorization token is missing.'}), 401

        try:
            # Decodificar el token JWT usando la SECRET_KEY
            SECRET_KEY = os.getenv('JWT_SECRET_KEY')
            if not SECRET_KEY:
                logging.error("JWT_SECRET_KEY is not configured in environment variables.")
                return jsonify({'error': 'Server configuration error.'}), 500

            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            user_id = data.get('user_id')

            if not user_id:
                logging.warning("Token is invalid: missing user_id.")
                return jsonify({'error': 'Invalid token: missing user_id.'}), 401

            # Recuperar el usuario desde la base de datos
            with get_db_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT user_id, username, email, preferred_language, two_factor_enabled
                    FROM users
                    WHERE user_id = %s;
                """, (user_id,))
                user = cursor.fetchone()

                if not user:
                    logging.warning(f"User not found for user_id {user_id}.")
                    return jsonify({'error': 'User not found.'}), 401

                # Almacenar el usuario actual en el contexto global de Flask
                g.current_user = {
                    "user_id": user[0],
                    "username": user[1],
                    "email": user[2],
                    "preferred_language": user[3],
                    "two_factor_enabled": user[4]
                }

        except jwt.ExpiredSignatureError:
            logging.warning("Token has expired.")
            return jsonify({'error': 'Token has expired.'}), 401
        except jwt.InvalidTokenError:
            logging.warning("Invalid token.")
            return jsonify({'error': 'Invalid token.'}), 401
        except Exception as e:
            logging.error(f"Error processing token: {e}", exc_info=True)
            return jsonify({'error': 'Internal server error.'}), 500

        # Continuar con la ejecución de la función de ruta, pasando el user_id como argumento
        return f(user_id, *args, **kwargs)
    return decorated
