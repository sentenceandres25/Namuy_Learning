# app/mailer/mailer.py

from flask_mail import Message
from app.extensions import mail
from flask import current_app

def send_email(subject, recipients, body):
    msg = Message(subject=subject, recipients=recipients, body=body)
    mail.send(msg)
