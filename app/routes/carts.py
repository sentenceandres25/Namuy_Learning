# app/routes/carts.py
from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.cart_models import Cart, CartItem
from app.models.product_models import Product
from app.models.user_models import Users

carts_blueprint = Blueprint('carts_blueprint', __name__)

@carts_blueprint.route('/<int:user_id>', methods=['GET'])
def get_cart(user_id):
    """
    Devuelve (o crea) el carrito de un usuario.
    """
    user = Users.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    cart = Cart.query.filter_by(user_id=user_id).first()
    if not cart:
        cart = Cart(user_id=user_id)
        db.session.add(cart)
        db.session.commit()

    items_data = []
    for item in cart.items:
        items_data.append({
            'id': item.id,
            'product_id': item.product_id,
            'quantity': item.quantity,
            'price': float(item.price),
            'created_at': item.created_at,
            'updated_at': item.updated_at
        })

    return jsonify({
        'cart_id': cart.id,
        'user_id': cart.user_id,
        'items': items_data
    }), 200


@carts_blueprint.route('/<int:user_id>/items', methods=['POST'])
def add_item_to_cart(user_id):
    """
    Agrega un item al carrito del usuario (o aumenta la cantidad si ya existe).
    Espera JSON con { "product_id": ..., "quantity": ... }.
    """
    user = Users.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'message': 'Invalid JSON'}), 400

    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)

    # Obtener (o crear) el carrito
    cart = Cart.query.filter_by(user_id=user_id).first()
    if not cart:
        cart = Cart(user_id=user_id)
        db.session.add(cart)
        db.session.commit()

    product = Product.query.get(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    # Ver si el item ya existe
    cart_item = CartItem.query.filter_by(cart_id=cart.id, product_id=product_id).first()
    if cart_item:
        cart_item.quantity += quantity
    else:
        cart_item = CartItem(
            cart_id=cart.id,
            product_id=product_id,
            quantity=quantity,
            price=product.price  # Copiamos el precio actual
        )
        db.session.add(cart_item)

    db.session.commit()
    return jsonify({'message': 'Item added/updated', 'item_id': cart_item.id}), 201


@carts_blueprint.route('/<int:user_id>/items/<int:item_id>', methods=['PUT'])
def update_cart_item(user_id, item_id):
    """
    Actualiza la cantidad de un item en el carrito.
    Espera JSON con { "quantity": ... }.
    """
    user = Users.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    cart = Cart.query.filter_by(user_id=user_id).first()
    if not cart:
        return jsonify({'message': 'Cart not found'}), 404

    cart_item = CartItem.query.filter_by(cart_id=cart.id, id=item_id).first()
    if not cart_item:
        return jsonify({'message': 'Cart item not found'}), 404

    data = request.get_json()
    new_quantity = data.get('quantity')
    if new_quantity is None:
        return jsonify({'message': 'No quantity provided'}), 400

    cart_item.quantity = new_quantity
    db.session.commit()

    return jsonify({'message': 'Cart item updated', 'item_id': cart_item.id}), 200


@carts_blueprint.route('/<int:user_id>/items/<int:item_id>', methods=['DELETE'])
def remove_cart_item(user_id, item_id):
    """
    Elimina un item del carrito.
    """
    user = Users.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    cart = Cart.query.filter_by(user_id=user_id).first()
    if not cart:
        return jsonify({'message': 'Cart not found'}), 404

    cart_item = CartItem.query.filter_by(cart_id=cart.id, id=item_id).first()
    if not cart_item:
        return jsonify({'message': 'Cart item not found'}), 404

    db.session.delete(cart_item)
    db.session.commit()
    return jsonify({'message': 'Item removed from cart'}), 200
