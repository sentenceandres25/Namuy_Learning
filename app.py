# app.py

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from routes.users import users_blueprint
from routes.auth import auth_blueprint
from routes.interests import interests_blueprint
from routes.sessionhistory import session_history_blueprint
from routes.personal_details import personal_details_blueprint
from routes.account_details import account_details_blueprint
from routes.profile_picture import profile_picture_blueprint  # <-- Nuevo import

from dotenv import load_dotenv
import os
import logging
from flask_mail import Mail
import sys

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    stream=sys.stdout,
    format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s'
)

app = Flask(__name__)

# Flask-Mail config
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True') == 'True'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', app.config['MAIL_USERNAME'])
app.config['MAIL_DEFAULT_CHARSET'] = 'utf-8'

mail = Mail(app)

# CORS
CORS(app,
     resources={r"/api/*": {"origins": "http://localhost:3000"}},
     supports_credentials=True,
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"])

# Registrar Blueprints
app.register_blueprint(users_blueprint, url_prefix="/api/user")
app.register_blueprint(auth_blueprint, url_prefix="/api/auth")
app.register_blueprint(interests_blueprint, url_prefix="/api/interests")
app.register_blueprint(session_history_blueprint, url_prefix="/api/session")
app.register_blueprint(personal_details_blueprint, url_prefix="/api/personal_details")
app.register_blueprint(account_details_blueprint, url_prefix="/api/account")

# Nuevo blueprint para profile_picture
app.register_blueprint(profile_picture_blueprint, url_prefix="/api/profile_picture")

app.config['STORAGE_TYPE'] = os.getenv('STORAGE_TYPE', 'local')

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
        debug=True
    )
