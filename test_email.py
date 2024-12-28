from flask import Flask
from flask_mail import Mail, Message
import os
from dotenv import load_dotenv
import traceback

# Cargar variables de entorno desde .env
load_dotenv()

app = Flask(__name__)

# Configurar Flask-Mail
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True') == 'True'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', app.config['MAIL_USERNAME'])
app.config['MAIL_DEFAULT_CHARSET'] = 'utf-8'

mail = Mail(app)

with app.app_context():
    try:
        msg = Message(
            subject="Prueba de Envío de Correo con ñ",
            recipients=["tu_correo@gmail.com"],  # Cambia esto por tu correo real
            body="Este es un correo de prueba enviado desde Flask-Mail con la letra ñ."
        )
        mail.send(msg)
        print("Correo enviado exitosamente.")
    except Exception as e:
        print(f"Error al enviar el correo: {e}")
        traceback.print_exc()
