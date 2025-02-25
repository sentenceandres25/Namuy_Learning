# app/routes/products.py
import traceback
from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.product_models import Product, ProductTranslation
from datetime import datetime

products_blueprint = Blueprint('products_blueprint', __name__)

@products_blueprint.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """
    Obtiene un producto por ID.
    Si se pasa ?lang=xx, busca la traducción en ese idioma.
    """
    try:
        lang = request.args.get('lang')
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'message': 'Product not found'}), 404

        response = {
            'id': product.id,
            'product_type': product.product_type,
            'rating': float(product.rating) if product.rating else 0,
            'duration': product.duration,
            'level': product.level,
            'price': float(product.price),
            'instructor': product.instructor,
            'languages': product.languages,
            'video_url': product.video_url,
            'created_at': product.created_at.isoformat() if product.created_at else None,
            'updated_at': product.updated_at.isoformat() if product.updated_at else None,
            'translation': None
        }

        if lang:
            translation = ProductTranslation.query.filter_by(
                product_id=product_id,
                language_code=lang
            ).first()
            if translation:
                response['translation'] = {
                    'language_code': translation.language_code,
                    'name': translation.name,
                    'description': translation.description,
                    'what_you_will_learn': translation.what_you_will_learn,
                    'course_content': translation.course_content,
                    'instructors_info': translation.instructors_info
                }
        return jsonify(response), 200

    except Exception as e:
        print("Error fetching product:", e)
        traceback.print_exc()  # Imprime la traza completa en la consola del servidor
        return jsonify({'message': 'Internal server error', 'error': str(e)}), 500

@products_blueprint.route('/', methods=['POST'])
def create_product():
    """
    Crea un nuevo producto (sin traducciones).
    Espera un JSON con los campos necesarios.
    """
    data = request.get_json()
    if not data:
        return jsonify({'message': 'Invalid JSON'}), 400

    new_product = Product(
        product_type=data.get('product_type', 'curso'),
        rating=data.get('rating', 0.0),
        duration=data.get('duration'),
        level=data.get('level'),
        price=data.get('price', 0.0),
        instructor=data.get('instructor'),
        languages=data.get('languages'),
        video_url=data.get('video_url')
    )
    db.session.add(new_product)
    db.session.commit()

    return jsonify({'message': 'Product created', 'id': new_product.id}), 201

@products_blueprint.route('/<int:product_id>/translation', methods=['POST'])
def add_product_translation(product_id):
    """
    Agrega (o actualiza) una traducción para un producto en un idioma dado.
    """
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'message': 'Invalid JSON'}), 400

    language_code = data.get('language_code')
    name = data.get('name')
    description = data.get('description')
    what_you_will_learn = data.get('what_you_will_learn')
    course_content = data.get('course_content')
    instructors_info = data.get('instructors_info')

    translation = ProductTranslation.query.filter_by(
        product_id=product_id,
        language_code=language_code
    ).first()

    if translation:
        translation.name = name
        translation.description = description
        translation.what_you_will_learn = what_you_will_learn
        translation.course_content = course_content
        translation.instructors_info = instructors_info
    else:
        translation = ProductTranslation(
            product_id=product_id,
            language_code=language_code,
            name=name,
            description=description,
            what_you_will_learn=what_you_will_learn,
            course_content=course_content,
            instructors_info=instructors_info
        )
        db.session.add(translation)

    db.session.commit()

    return jsonify({'message': 'Translation added/updated', 'translation_id': translation.id}), 201
