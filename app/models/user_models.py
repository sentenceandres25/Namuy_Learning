# app/models/user_models.py

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db

class Users(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), nullable=False, unique=True)
    password_hash = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    preferred_language = db.Column(db.String(10), nullable=False, default='en')
    two_factor_enabled = db.Column(db.Boolean, nullable=False, default=False)

    # Relationship with PersonalDetails
    personal_details = db.relationship('PersonalDetails', backref='user', uselist=False)

    # Relationship with TwoFactorCode
    two_factor_codes = db.relationship('TwoFactorCode', backref='user', lazy=True)

    def set_password(self, password):
        """
        Hashes and sets the user's password.
        """
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """
        Checks if the provided password matches the stored hash.
        """
        return check_password_hash(self.password_hash, password)


class PersonalDetails(db.Model):
    __tablename__ = 'personal_details'

    personal_detail_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False, unique=True)
    full_name = db.Column(db.String(150), nullable=False)
    student_id = db.Column(db.String(50), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    alt_email = db.Column(db.String(255), nullable=True)
    contact_number = db.Column(db.String(50), nullable=True)
    id_type = db.Column(db.String(50), nullable=True)
    id_number = db.Column(db.String(50), nullable=True)
    birth_date = db.Column(db.Date, nullable=True)
    country_of_residence = db.Column(db.String(100), nullable=True)
    last_update = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    last_access = db.Column(db.DateTime(timezone=True), nullable=True)
    pending_approval = db.Column(db.Boolean, nullable=False, default=False)
    doc_type = db.Column(db.String(50), nullable=True)
    doc_url = db.Column(db.String(255), nullable=True)

    # Relationship with TwoFactorCode (if needed)
    # two_factor_codes = db.relationship('TwoFactorCode', backref='personal_details', lazy=True)


class TwoFactorCode(db.Model):
    __tablename__ = 'two_factor_codes'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    code = db.Column(db.String(6), nullable=False)
    method = db.Column(db.String(10), nullable=False, default='email')  # e.g., 'email' or 'sms'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)
    attempts = db.Column(db.Integer, default=0)

    def is_expired(self):
        """
        Checks if the verification code has expired.
        """
        return datetime.utcnow() > self.expires_at

    def increment_attempts(self):
        """
        Increments the number of verification attempts.
        """
        self.attempts += 1

    def __repr__(self):
        return f'<TwoFactorCode {self.code} for user_id {self.user_id}>'
