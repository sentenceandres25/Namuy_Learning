# app/routes/session_history.py

from flask import Blueprint, jsonify
from app.db.connection import get_db_connection
import logging
from app.utils.decorators import token_required  # Asegúrate de tener este decorador correctamente implementado

# Inicializar el Blueprint para las rutas de historial de sesión
session_history_blueprint = Blueprint('session_history_blueprint', __name__)

@session_history_blueprint.route('/last-access', methods=['GET'])
@token_required
def get_last_access(user_id):
    """
    Recupera el último acceso del usuario autenticado desde personal_details.
    
    Args:
        user_id (int): El ID del usuario autenticado, proporcionado por el decorador token_required.
    
    Returns:
        JSON con el user_id y el timestamp de last_access, o un mensaje de error.
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT last_access
                FROM personal_details
                WHERE user_id = %s;
            """, (user_id,))
            row = cursor.fetchone()

            if row is None:
                logging.warning(f"Personal details not found for user_id {user_id}")
                return jsonify({"error": "User not found"}), 404

            last_access = row[0]  # Puede ser None si nunca se ha registrado
            last_access_iso = last_access.isoformat() if last_access else None

            response = {
                "user_id": user_id,
                "last_access": last_access_iso
            }
            return jsonify(response), 200

    except Exception as e:
        logging.error(f"Error retrieving last_access for user_id {user_id}: {e}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500


@session_history_blueprint.route('/last-access', methods=['PUT'])
@token_required
def update_last_access(user_id):
    """
    Actualiza la columna last_access con la hora/fecha actual (CURRENT_TIMESTAMP) para el usuario autenticado.
    
    Args:
        user_id (int): El ID del usuario autenticado, proporcionado por el decorador token_required.
    
    Returns:
        JSON confirmando la actualización con el nuevo timestamp de last_access, o un mensaje de error.
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE personal_details
                SET last_access = CURRENT_TIMESTAMP
                WHERE user_id = %s
                RETURNING last_access;
            """, (user_id,))
            updated_row = cursor.fetchone()

            if not updated_row:
                logging.warning(f"Personal details not found for user_id {user_id}")
                return jsonify({"error": "User not found"}), 404

            # Confirmar la transacción
            conn.commit()

            # updated_row[0] es el valor actualizado de last_access
            last_access_iso = updated_row[0].isoformat() if updated_row[0] else None
            response = {
                "message": "Last access updated successfully",
                "last_access": last_access_iso
            }
            return jsonify(response), 200

    except Exception as e:
        # No es necesario hacer rollback manualmente ya que el context manager lo maneja
        logging.error(f"Error updating last_access for user_id {user_id}: {e}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500
