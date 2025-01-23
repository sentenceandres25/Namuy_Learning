# app/config.py

import os
from dotenv import load_dotenv

# Load environment variables from a .env file located in the root directory
load_dotenv()

class Config:
    # -----------------------
    # General Configurations
    # -----------------------
    SECRET_KEY = os.getenv('SECRET_KEY')
    DEBUG = os.getenv('DEBUG') == 'True'
    
    # -----------------------
    # Database Configurations
    # -----------------------
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URI'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Database Connection Pooling (Optional)
    SQLALCHEMY_POOL_SIZE = int(os.getenv('SQLALCHEMY_POOL_SIZE'))
    SQLALCHEMY_MAX_OVERFLOW = int(os.getenv('SQLALCHEMY_MAX_OVERFLOW'))
    
    # -----------------------
    # JWT Configuration
    # -----------------------
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    JWT_ALGORITHM = os.getenv('JWT_ALGORITHM')
    JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES'))  # in seconds
    
    # -----------------------
    # Flask-Mail Configuration
    # -----------------------
    MAIL_SERVER = os.getenv('MAIL_SERVER')
    MAIL_PORT = int(os.getenv('MAIL_PORT'))
    MAIL_USE_TLS = os.getenv('MAIL_USE_TLS') == 'True'
    MAIL_USE_SSL = os.getenv('MAIL_USE_SSL') == 'True'
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.getenv('MAIL_DEFAULT_SENDER')
    
    # -----------------------
    # Twilio Configuration
    # -----------------------
    TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
    TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
    TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')
    
    # -----------------------
    # Rate Limiting Configurations
    # -----------------------
    RATELIMIT_DEFAULT = os.getenv('RATELIMIT_DEFAULT')
    RATELIMIT_STORAGE_URI = os.getenv('RATELIMIT_STORAGE_URI')
    
    # -----------------------
    # Logging Configurations
    # -----------------------
    LOG_LEVEL = os.getenv('LOG_LEVEL').upper()
    LOG_FILE = os.getenv('LOG_FILE')
    LOG_MAX_BYTES = int(os.getenv('LOG_MAX_BYTES'))  # 10 MB
    LOG_BACKUP_COUNT = int(os.getenv('LOG_BACKUP_COUNT'))

        # Database Configurations
    DB_HOST = os.getenv('DB_HOST')
    DB_PORT = int(os.getenv('DB_PORT'))
    DB_NAME = os.getenv('DB_NAME')
    DB_USER = os.getenv('DB_USER')
    DB_PASSWORD = os.getenv('DB_PASSWORD')

        # SMTP configurations for sending emails
    SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    SMTP_PORT = int(os.getenv('SMTP_PORT', 587))
    SMTP_USERNAME = os.getenv('SMTP_USERNAME', 'your_email@example.com')
    SMTP_PASSWORD = os.getenv('SMTP_PASSWORD', 'your_email_password')
    FROM_EMAIL = os.getenv('FROM_EMAIL', 'no-reply@example.com')

    # Two-Factor Authentication configurations
    TWO_FACTOR_CODE_EXPIRY_MINUTES = int(os.getenv('TWO_FACTOR_CODE_EXPIRY_MINUTES', 10))
    TWO_FACTOR_MAX_ATTEMPTS = int(os.getenv('TWO_FACTOR_MAX_ATTEMPTS', 5))