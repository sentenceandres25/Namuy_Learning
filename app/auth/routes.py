# app/auth/routes.py

from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.user_models import PersonalDetails
import jwt
import datetime
from flask import current_app
from werkzeug.security import check_password_hash
from app.auth.decorators import token_required

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Correo y contraseña son requeridos'}), 400

    email = data['email']
    password = data['password']

    user = PersonalDetails.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Credenciales inválidas'}), 401

    token = jwt.encode({
        'user_id': user.user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, current_app.config['JWT_SECRET_KEY'], algorithm="HS256")

    return jsonify({'token': token}), 200

# Otras rutas de autenticación (registro, logout, etc.) pueden ser agregadas aquí
