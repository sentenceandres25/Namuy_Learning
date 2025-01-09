# app.py

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import os
import logging
from flask_mail import Mail
import sys
from app.extensions import db
from app import create_app

# Cargar variables de entorno desde .env
load_dotenv()

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    stream=sys.stdout,
    format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s'
)

# Crear la aplicación Flask
app = Flask(__name__)

# Configuración de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI', 'postgresql://postgres:JaOb019640.@localhost:5432/namuy_learning')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar la extensión de la base de datos
db.init_app(app)

# Configuración de Flask-Mail
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True') == 'True'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', app.config['MAIL_USERNAME'])
app.config['MAIL_DEFAULT_CHARSET'] = 'utf-8'

# Agregar JWT_SECRET_KEY
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'tu_clave_secreta_jwt')

# Inicializar Flask-Mail
mail = Mail(app)

# Configuración de CORS
CORS(app,
     resources={r"/api/*": {"origins": "http://localhost:3000"}},
     supports_credentials=True,
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"])

# Importar y registrar Blueprints desde la carpeta app/routes/
from app.routes import (
    users_blueprint,
    auth_blueprint,
    interests_blueprint,
    session_history_blueprint,
    personal_details_blueprint,
    account_details_blueprint,
    profile_picture_blueprint,
    notifications_blueprint,
    two_factor_bp  # Añadir esta línea
)

# Registrar Blueprints con sus respectivos prefixes
app.register_blueprint(users_blueprint, url_prefix="/api/users")
app.register_blueprint(auth_blueprint, url_prefix="/api/auth")
app.register_blueprint(interests_blueprint, url_prefix="/api/interests")
app.register_blueprint(session_history_blueprint, url_prefix="/api/session")
app.register_blueprint(personal_details_blueprint, url_prefix="/api/personal_details")
app.register_blueprint(account_details_blueprint, url_prefix="/api/account")
app.register_blueprint(notifications_blueprint, url_prefix="/api/notifications")
app.register_blueprint(profile_picture_blueprint, url_prefix="/api/profile_picture")
app.register_blueprint(two_factor_bp, url_prefix="/api/users/2fa")  # Añadir esta línea

# Configuración adicional
app.config['STORAGE_TYPE'] = os.getenv('STORAGE_TYPE', 'local')

# Ruta para servir archivos subidos
@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(os.path.join(app.root_path, 'uploads'), filename)

# Ruta para listar todas las rutas disponibles (útil para depuración)
@app.route('/api/routes', methods=['GET'])
def list_routes():
    import urllib
    output = {}
    for rule in app.url_map.iter_rules():
        methods = ','.join(sorted(rule.methods))
        line = urllib.parse.unquote(f"{rule.endpoint}: {rule}")
        output[line] = methods
    return jsonify(output)

# Ejecutar la aplicación
if __name__ == '__main__':
    print("JWT_SECRET_KEY:", app.config['JWT_SECRET_KEY'])  # **Eliminar después de la verificación**
    app.run(
        host=os.getenv('FLASK_HOST', 'localhost'),
        port=int(os.getenv('FLASK_PORT', 3001)),
        debug=True
    )
