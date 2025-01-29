# app/utils/email_utils.py

import random
import string
import smtplib
from email.mime.text import MIMEText
import logging
from threading import Thread
from app.config import Config
from app.db.connection import get_db_connection

def generate_verification_code(length=6):
    """
    Generates a random numeric verification code of specified length.
    
    Args:
        length (int): The length of the verification code. Default is 6.
    
    Returns:
        str: A string containing random digits.
    """
    return ''.join(random.choices(string.digits, k=length))


def send_verification_email_async(user_id, code):
    """
    Sends a verification email asynchronously to prevent blocking API responses.
    The email content is based on the user's preferred language.
    
    Args:
        user_id (int): The ID of the user to whom the email will be sent.
        code (str): The verification code to include in the email.
    """
    thread = Thread(target=send_verification_email, args=(user_id, code))
    thread.start()


def send_verification_email(user_id, code):
    """
    Sends a verification email with the provided code to the specified user's email address.
    The email content is sent in the user's preferred language.
    
    Args:
        user_id (int): The ID of the user to whom the email will be sent.
        code (str): The verification code to include in the email.
    """
    try:
        # Recuperar el correo electrónico y el idioma preferido del usuario desde la base de datos
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT email, preferred_language FROM users WHERE user_id = %s;
            """, (user_id,))
            result = cursor.fetchone()
            if not result:
                logging.error(f"User with user_id={user_id} not found.")
                return
            email, preferred_language = result

        # Determinar el asunto y el cuerpo del correo electrónico basado en el idioma preferido
        if preferred_language == 'en':
            subject = "Your 2FA Verification Code"
            body = f"Your two-factor authentication verification code is: {code}\nThis code will expire in 10 minutes."
        elif preferred_language == 'es':
            subject = "Tu Código de Verificación de 2FA"
            body = f"Tu código de verificación de autenticación de dos factores es: {code}\nEste código expirará en 10 minutos."
        else:
            # Predeterminado a Inglés si el idioma preferido no está soportado
            subject = "Your 2FA Verification Code"
            body = f"Your two-factor authentication verification code is: {code}\nThis code will expire in 10 minutes."

        # Configuración del servidor SMTP
        smtp_server = Config.SMTP_SERVER
        smtp_port = Config.SMTP_PORT
        smtp_username = Config.SMTP_USERNAME
        smtp_password = Config.SMTP_PASSWORD
        from_email = Config.FROM_EMAIL

        # Crear el contenido del correo electrónico
        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From'] = from_email
        msg['To'] = email

        # Enviar el correo electrónico
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()  # Asegurar la conexión
            server.login(smtp_username, smtp_password)
            server.sendmail(from_email, email, msg.as_string())

        logging.info(f"Verification email sent to {email} in {preferred_language} language.")

    except Exception as e:
        logging.error(f"Failed to send verification email to user_id={user_id}: {e}", exc_info=True)
        raise


def send_verification_sms_async(user_id, code):
    """
    Sends a verification SMS asynchronously to prevent blocking API responses.
    The SMS content is based on the user's preferred language.
    
    Args:
        user_id (int): The ID of the user to whom the SMS will be sent.
        code (str): The verification code to include in the SMS.
    """
    thread = Thread(target=send_verification_sms, args=(user_id, code))
    thread.start()


def send_verification_sms(user_id, code):
    """
    Sends a verification SMS with the provided code to the specified user's phone number.
    The SMS content is sent in the user's preferred language.
    
    Args:
        user_id (int): The ID of the user to whom the SMS will be sent.
        code (str): The verification code to include in the SMS.
    """
    try:
        # Recuperar el número de teléfono y el idioma preferido del usuario desde la base de datos
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT phone_number, preferred_language FROM users WHERE user_id = %s;
            """, (user_id,))
            result = cursor.fetchone()
            if not result:
                logging.error(f"User with user_id={user_id} not found.")
                return
            phone_number, preferred_language = result

        if not phone_number:
            logging.error(f"User with user_id={user_id} does not have a phone number.")
            return

        # Determinar el contenido del SMS basado en el idioma preferido
        if preferred_language == 'en':
            body = f"Your two-factor authentication code is: {code}. It will expire in 10 minutes."
        elif preferred_language == 'es':
            body = f"Tu código de autenticación de dos factores es: {code}. Este código expirará en 10 minutos."
        else:
            # Predeterminado a Inglés si el idioma preferido no está soportado
            body = f"Your two-factor authentication code is: {code}. It will expire in 10 minutes."

        # Implementar la lógica real de envío de SMS aquí
        # Por ejemplo, usando un servicio como Twilio:
        # send_sms(phone_number, body)
        # Reemplaza la siguiente línea con la integración de tu servicio de SMS
        send_sms(phone_number, body)

        logging.info(f"Verification SMS sent to {phone_number} in {preferred_language} language.")

    except Exception as e:
        logging.error(f"Failed to send verification SMS to user_id={user_id}: {e}", exc_info=True)
        raise


def send_sms(phone_number, body):
    """
    Sends an SMS with the provided body to the specified phone number.
    Reemplaza la implementación con la API de tu proveedor de servicios de SMS.
    
    Args:
        phone_number (str): The recipient's phone number.
        body (str): The message body to send.
    """
    try:
        # Implementación de ejemplo (placeholder)
        # Integra con un servicio de SMS como Twilio, Nexmo, etc.
        # Para propósitos de demostración, solo registramos el contenido del SMS
        logging.info(f"Sending SMS to {phone_number}: {body}")
        # Implementa la lógica real de envío de SMS aquí
        pass
    except Exception as e:
        logging.error(f"Failed to send SMS to {phone_number}: {e}", exc_info=True)
        raise
