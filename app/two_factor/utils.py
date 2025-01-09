# app/two_factor/utils.py

import random
from app.mailer.mailer import send_email
from app.sms.sms_service import send_sms

def generate_verification_code():
    """Genera un código de verificación de 6 dígitos."""
    return '{:06d}'.format(random.randint(0, 999999))

def send_verification_email(email, code):
    """Envía un correo electrónico con el código de verificación."""
    subject = "Tu código de verificación de 2FA"
    body = f"Tu código de verificación es: {code}. Este código expirará en 10 minutos."
    send_email(subject, [email], body)

def send_verification_sms(phone_number, code):
    """Envía un SMS con el código de verificación."""
    body = f"Tu código de verificación de 2FA es: {code}. Este código expirará en 10 minutos."
    send_sms(phone_number, body)
