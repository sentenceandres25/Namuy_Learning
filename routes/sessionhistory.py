# sessionhistory.py
from flask import Blueprint, request, jsonify
from db.connection import get_db_connection
import pg8000.dbapi
import logging

session_history_blueprint = Blueprint('session_history_blueprint', __name__)

@session_history_blueprint.route('/<int:user_id>/last-access', methods=['GET'])
def get_last_access(user_id):
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
        """, (user_id,))
        row = cursor.fetchone()
        if row is None:
            return jsonify({"error": "User not found"}), 404

        last_access = row[0]  # Puede ser None si nunca se ha registrado
        return jsonify({
            "user_id": user_id,
            "last_access": last_access.isoformat() if last_access else None
        }), 200

    except Exception as e:
        logging.error(f"Error getting last_access for user_id {user_id}: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@session_history_blueprint.route('/<int:user_id>/last-access', methods=['PUT'])
def update_last_access(user_id):
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
        """, (user_id,))
        updated_row = cursor.fetchone()
        if not updated_row:
            conn.rollback()
            return jsonify({"error": "User not found"}), 404

        conn.commit()

        # updated_row[0] es el valor de last_access que acabamos de actualizar
        return jsonify({
            "message": "Last access updated successfully",
            "last_access": updated_row[0].isoformat()
        }), 200

    except Exception as e:
        conn.rollback()
        logging.error(f"Error updating last_access for user_id {user_id}: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()
