# routes/session_history.py

from flask import Blueprint, jsonify
from db.connection import get_db_connection
import pg8000.dbapi
import logging
from utils.decorators import token_required  # Asegúrate de tener este decorador

session_history_blueprint = Blueprint('session_history_blueprint', __name__)

@session_history_blueprint.route('/last-access', methods=['GET'])
@token_required
def get_last_access(current_user_id):
    """
    Devuelve el último acceso (last_access) del usuario en personal_details.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT last_access
            FROM personal_details
            WHERE user_id = %s;
        """, (current_user_id,))
        row = cursor.fetchone()
        if row is None:
            return jsonify({"error": "Usuario no encontrado"}), 404

        last_access = row[0]  # Puede ser None si nunca se ha registrado
        return jsonify({
            "user_id": current_user_id,
            "last_access": last_access.isoformat() if last_access else None
        }), 200

    except Exception as e:
        logging.error(f"Error al obtener last_access para user_id {current_user_id}: {e}", exc_info=True)
        return jsonify({"error": "Error interno del servidor"}), 500
    finally:
        conn.close()

@session_history_blueprint.route('/last-access', methods=['PUT'])
@token_required
def update_last_access(current_user_id):
    """
    Actualiza la columna last_access con la hora/fecha actual (CURRENT_TIMESTAMP).
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE personal_details
            SET last_access = CURRENT_TIMESTAMP
            WHERE user_id = %s
            RETURNING last_access;
        """, (current_user_id,))
        updated_row = cursor.fetchone()
        if not updated_row:
            conn.rollback()
            return jsonify({"error": "Usuario no encontrado"}), 404

        conn.commit()

        # updated_row[0] es el valor de last_access que acabamos de actualizar
        return jsonify({
            "message": "Último acceso actualizado exitosamente",
            "last_access": updated_row[0].isoformat()
        }), 200

    except Exception as e:
        conn.rollback()
        logging.error(f"Error al actualizar last_access para user_id {current_user_id}: {e}", exc_info=True)
        return jsonify({"error": "Error interno del servidor"}), 500
    finally:
        conn.close()
