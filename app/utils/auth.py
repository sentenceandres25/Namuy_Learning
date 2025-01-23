import jwt
import datetime
from flask import current_app

def generate_auth_token(user_id, secret_key=None):
    """
    Genera un token de autenticación JWT para el usuario dado.
    """
    secret_key = secret_key or current_app.config['SECRET_KEY']
    payload = {
        "user_id": user_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)  # Token expira en 2 horas
    }
    return jwt.encode(payload, secret_key, algorithm="HS256")
