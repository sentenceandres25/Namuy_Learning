# app/models/product_models.py
from app.extensions import db
from datetime import datetime

class Product(db.Model):
    __tablename__ = 'product'

    id = db.Column(db.BigInteger, primary_key=True)
    product_type = db.Column(db.String(50), nullable=False)
    rating = db.Column(db.Numeric(2,1), default=0)
    duration = db.Column(db.String(50))
    level = db.Column(db.String(50))
    price = db.Column(db.Numeric(10,2), default=0.00)
    instructor = db.Column(db.String(100))
    languages = db.Column(db.String(255))
    video_url = db.Column(db.Text)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relación uno-a-muchos con sus traducciones
    translations = db.relationship(
        'ProductTranslation',
        backref='product',
        cascade='all, delete-orphan'
    )

class ProductTranslation(db.Model):
    __tablename__ = 'product_translation'

    id = db.Column(db.BigInteger, primary_key=True)
    product_id = db.Column(db.BigInteger, db.ForeignKey('product.id', ondelete='CASCADE'), nullable=False)
    language_code = db.Column(db.String(10), nullable=False)

    # Campos traducibles
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    what_you_will_learn = db.Column(db.Text)
    course_content = db.Column(db.Text)
    instructors_info = db.Column(db.Text)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
