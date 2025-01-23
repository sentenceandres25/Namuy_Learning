# app/utils/email_utils.py

import random
import string
import smtplib
from email.mime.text import MIMEText
import logging
from threading import Thread
from app.config import Config
from app.models.user_models import Users
from app.db.connection import get_db_connection, return_db_connection

def generate_verification_code(length=6):
    """
    Generates a random numeric verification code of specified length.
    """
    return ''.join(random.choices(string.digits, k=length))


def send_verification_email_async(user_id, code):
    """
    Sends a verification email asynchronously to prevent blocking API responses.
    The email content is based on the user's preferred language.
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
        # Retrieve the user's email and preferred language from the database
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT email, preferred_language FROM users WHERE user_id = %s;
            """, (user_id,))
            result = cursor.fetchone()
            if not result:
                logging.error(f"User with user_id={user_id} not found.")
                return
            email, preferred_language = result
        return_db_connection(conn)

        # Determine the email subject and body based on the preferred language
        if preferred_language == 'en':
            subject = "Your 2FA Verification Code"
            body = f"Your two-factor authentication verification code is: {code}\nThis code will expire in 10 minutes."
        elif preferred_language == 'es':
            subject = "Tu Código de Verificación de 2FA"
            body = f"Tu código de verificación de autenticación de dos factores es: {code}\nEste código expirará en 10 minutos."
        else:
            # Default to English if the preferred language is not supported
            subject = "Your 2FA Verification Code"
            body = f"Your two-factor authentication verification code is: {code}\nThis code will expire in 10 minutes."

        # SMTP server configuration
        smtp_server = Config.SMTP_SERVER
        smtp_port = Config.SMTP_PORT
        smtp_username = Config.SMTP_USERNAME
        smtp_password = Config.SMTP_PASSWORD
        from_email = Config.FROM_EMAIL

        # Create the email content
        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From'] = from_email
        msg['To'] = email

        # Send the email
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()  # Secure the connection
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
        # Retrieve the user's phone number and preferred language from the database
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT phone_number, preferred_language FROM users WHERE user_id = %s;
            """, (user_id,))
            result = cursor.fetchone()
            if not result:
                logging.error(f"User with user_id={user_id} not found.")
                return
            phone_number, preferred_language = result
        return_db_connection(conn)

        if not phone_number:
            logging.error(f"User with user_id={user_id} does not have a phone number.")
            return

        # Determine the SMS body based on the preferred language
        if preferred_language == 'en':
            body = f"Your two-factor authentication code is: {code}. It will expire in 10 minutes."
        elif preferred_language == 'es':
            body = f"Tu código de autenticación de dos factores es: {code}. Este código expirará en 10 minutos."
        else:
            # Default to English if the preferred language is not supported
            body = f"Your two-factor authentication code is: {code}. It will expire in 10 minutes."

        # Implement the actual SMS sending logic here
        # For example, using a service like Twilio:
        # send_sms(phone_number, body)
        # Replace the following line with your SMS service integration
        send_sms(phone_number, body)

        logging.info(f"Verification SMS sent to {phone_number} in {preferred_language} language.")

    except Exception as e:
        logging.error(f"Failed to send verification SMS to user_id={user_id}: {e}", exc_info=True)
        raise


def send_sms(phone_number, body):
    """
    Sends an SMS with the provided body to the specified phone number.
    Replace the implementation with your SMS service provider's API.
    
    Args:
        phone_number (str): The recipient's phone number.
        body (str): The message body to send.
    """
    try:
        # Example placeholder implementation
        # Integrate with an SMS service like Twilio, Nexmo, etc.
        # For demonstration purposes, we'll log the SMS content
        logging.info(f"Sending SMS to {phone_number}: {body}")
        # Implement actual SMS sending logic here
        pass
    except Exception as e:
        logging.error(f"Failed to send SMS to {phone_number}: {e}", exc_info=True)
        raise
