# app/models/cart_models.py
from app.extensions import db
from datetime import datetime

class Cart(db.Model):
    __tablename__ = 'carts'

    id = db.Column(db.BigInteger, primary_key=True)
    # Relaciona el carrito con tu tabla de usuarios (users.user_id)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relación uno-a-muchos con los items
    items = db.relationship(
        'CartItem',
        backref='cart',
        cascade='all, delete-orphan'
    )

class CartItem(db.Model):
    __tablename__ = 'cart_items'

    id = db.Column(db.BigInteger, primary_key=True)
    cart_id = db.Column(db.BigInteger, db.ForeignKey('carts.id', ondelete='CASCADE'), nullable=False)
    product_id = db.Column(db.BigInteger, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    price = db.Column(db.Numeric(10,2), default=0.00)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
