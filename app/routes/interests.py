# app/routes/interests.py

from flask import Blueprint, request, jsonify, current_app
from app.db.connection import get_db_connection
import logging
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from app.utils.decorators import token_required  # Asegúrate de proteger las rutas si es necesario

# Inicializar el Blueprint para rutas relacionadas con intereses
interests_blueprint = Blueprint('interests_blueprint', __name__, url_prefix='/api/interests')

# Inicializar el Rate Limiter específicamente para este Blueprint
limiter = Limiter(
    key_func=get_remote_address
)

# Aplicar rate limiting a las rutas de este Blueprint
interests_blueprint.before_request(limiter.check)


@interests_blueprint.route('/<int:user_id>', methods=['GET'])
@token_required  # Protege la ruta para que solo usuarios autenticados puedan acceder
@limiter.limit("100 per hour")  # Limitar a 100 solicitudes por hora
def get_user_interests(current_user_id, user_id):
    """
    Obtiene todos los intereses de un usuario.

    Args:
        current_user_id (int): El ID del usuario autenticado.
        user_id (int): El ID del usuario cuyos intereses se desean obtener.

    Returns:
        JSON con la lista de intereses o un mensaje de error.
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT interest_name
                FROM user_interests
                WHERE user_id = %s
                ORDER BY user_interest_id;
            """, (user_id,))
            rows = cursor.fetchall()
            interests = [row[0] for row in rows]
            return jsonify({"user_id": user_id, "interests": interests}), 200
    except Exception as e:
        logging.error(f"Error en GET /interests/{user_id}: {e}", exc_info=True)
        return jsonify({"error": "Error interno del servidor"}), 500


@interests_blueprint.route('/<int:user_id>', methods=['POST'])
@token_required  # Protege la ruta para que solo usuarios autenticados puedan acceder
@limiter.limit("50 per hour")  # Limitar a 50 solicitudes por hora
def add_user_interest(current_user_id, user_id):
    """
    Agrega un nuevo interés a un usuario.
    Espera un JSON { "interest": "..." } en el body.

    Args:
        current_user_id (int): El ID del usuario autenticado.
        user_id (int): El ID del usuario al que se agregará el interés.

    Returns:
        JSON confirmando la adición o un mensaje de error.
    """
    if not request.is_json:
        return jsonify({"error": "Content-Type debe ser 'application/json'"}), 415
    
    data = request.get_json()
    interest = data.get('interest')
    if not interest or not isinstance(interest, str):
        return jsonify({"error": "Se requiere el campo 'interest' y debe ser un string"}), 400

    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO user_interests (user_id, interest_name)
                VALUES (%s, %s)
                ON CONFLICT (user_id, interest_name) DO NOTHING
                RETURNING user_interest_id;
            """, (user_id, interest.strip()))
            inserted = cursor.fetchone()
            if inserted:
                conn.commit()
                return jsonify({"message": "Interés agregado exitosamente", 
                                "interest": interest}), 201
            else:
                # Si inserted es None, significa que ya existía ese interés
                return jsonify({"message": "El interés ya existía o no se insertó", 
                                "interest": interest}), 200
    except Exception as e:
        logging.error(f"Error en POST /interests/{user_id}: {e}", exc_info=True)
        return jsonify({"error": "Error interno del servidor"}), 500


@interests_blueprint.route('/<int:user_id>', methods=['DELETE'])
@token_required  # Protege la ruta para que solo usuarios autenticados puedan acceder
@limiter.limit("30 per hour")  # Limitar a 30 solicitudes por hora
def remove_user_interest(current_user_id, user_id):
    """
    Elimina un interés de un usuario.
    Espera un JSON { "interest": "..." } en el body.

    Args:
        current_user_id (int): El ID del usuario autenticado.
        user_id (int): El ID del usuario del cual se eliminará el interés.

    Returns:
        JSON confirmando la eliminación o un mensaje de error.
    """
    if not request.is_json:
        return jsonify({"error": "Content-Type debe ser 'application/json'"}), 415

    data = request.get_json()
    interest = data.get('interest')
    if not interest or not isinstance(interest, str):
        return jsonify({"error": "Se requiere el campo 'interest' y debe ser un string"}), 400
    
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                DELETE FROM user_interests
                WHERE user_id = %s AND interest_name = %s
                RETURNING user_interest_id;
            """, (user_id, interest.strip()))
            deleted = cursor.fetchone()
            if deleted:
                conn.commit()
                return jsonify({"message": "Interés eliminado exitosamente", 
                                "interest": interest}), 200
            else:
                return jsonify({"message": "El interés no existía para este usuario"}), 200
    except Exception as e:
        logging.error(f"Error en DELETE /interests/{user_id}: {e}", exc_info=True)
        return jsonify({"error": "Error interno del servidor"}), 500
