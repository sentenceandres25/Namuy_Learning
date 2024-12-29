from flask import Blueprint, request, jsonify, current_app
from db.connection import get_db_connection
import pg8000.dbapi
import logging

interests_blueprint = Blueprint('interests', __name__)

@interests_blueprint.route('/<int:user_id>', methods=['GET'])
def get_user_interests(user_id):
    """
    Obtiene todos los intereses de un usuario.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
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
        logging.error(f"Error en get_user_interests para user_id {user_id}: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@interests_blueprint.route('/<int:user_id>', methods=['POST'])
def add_user_interest(user_id):
    """
    Agrega un nuevo interés a un usuario.
    Espera un JSON { "interest": "..." } en el body.
    """
    if not request.is_json:
        return jsonify({"error": "Content-Type debe ser 'application/json'"}), 415
    
    data = request.get_json()
    interest = data.get('interest')
    if not interest or not isinstance(interest, str):
        return jsonify({"error": "Se requiere el campo 'interest' y debe ser un string"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO user_interests (user_id, interest_name)
            VALUES (%s, %s)
            ON CONFLICT (user_id, interest_name) DO NOTHING
            RETURNING user_interest_id;
        """, (user_id, interest.strip()))
        inserted = cursor.fetchone()
        conn.commit()

        # Si inserted es None, significa que ya existía ese interés
        if not inserted:
            return jsonify({"message": "El interés ya existía o no se insertó", 
                            "interest": interest}), 200

        return jsonify({"message": "Interés agregado exitosamente", 
                        "interest": interest}), 201
    except Exception as e:
        conn.rollback()
        logging.error(f"Error en add_user_interest para user_id {user_id}: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@interests_blueprint.route('/<int:user_id>', methods=['DELETE'])
def remove_user_interest(user_id):
    """
    Elimina un interés de un usuario.
    Espera un JSON { "interest": "..." } en el body.
    """
    if not request.is_json:
        return jsonify({"error": "Content-Type debe ser 'application/json'"}), 415

    data = request.get_json()
    interest = data.get('interest')
    if not interest or not isinstance(interest, str):
        return jsonify({"error": "Se requiere el campo 'interest' y debe ser un string"}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            DELETE FROM user_interests
            WHERE user_id = %s AND interest_name = %s
            RETURNING user_interest_id;
        """, (user_id, interest.strip()))
        deleted = cursor.fetchone()
        conn.commit()

        if not deleted:
            return jsonify({"message": "El interés no existía para este usuario"}), 200

        return jsonify({"message": "Interés eliminado exitosamente", 
                        "interest": interest}), 200
    except Exception as e:
        conn.rollback()
        logging.error(f"Error en remove_user_interest para user_id {user_id}: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()
