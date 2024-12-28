# app.py

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from routes.users import users_blueprint
from routes.auth import auth_blueprint
from dotenv import load_dotenv
import os
import logging
from flask_mail import Mail
import sys

# Cargar las variables de entorno desde .env
load_dotenv()

# Configurar logging para errores y otros niveles, enviándolos a la consola
logging.basicConfig(
    level=logging.INFO,  # Cambiado de ERROR a INFO para capturar más detalles
    stream=sys.stdout,   # Enviar logs a la consola
    format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s'
)

app = Flask(__name__)

# Configurar Flask-Mail
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True') == 'True'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', app.config['MAIL_USERNAME'])
app.config['MAIL_DEFAULT_CHARSET'] = 'utf-8'

# Inicializar Flask-Mail
mail = Mail(app)

# Configurar CORS para permitir solicitudes desde el frontend en http://localhost:3000
CORS(app, resources={
    r"/api/*": {
        "origins": "http://localhost:3000"
    }
}, supports_credentials=True,
methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
allow_headers=["Content-Type", "Authorization"])

# Registrar los blueprints
app.register_blueprint(users_blueprint, url_prefix="/api/user")
app.register_blueprint(auth_blueprint, url_prefix="/api/auth")

# Variable para almacenamiento local (puede cambiarse a 's3' en el futuro)
app.config['STORAGE_TYPE'] = os.getenv('STORAGE_TYPE', 'local')

# Ruta para servir archivos subidos localmente
@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(os.path.join(app.root_path, 'uploads'), filename)

@app.route('/api/routes', methods=['GET'])
def list_routes():
    import urllib
    output = {}
    for rule in app.url_map.iter_rules():
        methods = ','.join(sorted(rule.methods))
        line = urllib.parse.unquote(f"{rule.endpoint}: {rule}")
        output[line] = methods
    return jsonify(output)

if __name__ == '__main__':
    app.run(
        host=os.getenv('FLASK_HOST', 'localhost'),
        port=int(os.getenv('FLASK_PORT', 3001)),
        debug=True  # Establecido en True para facilitar la depuración
    )
