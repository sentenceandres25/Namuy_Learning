from flask import Blueprint, request, jsonify, g
from app.db.connection import get_db_connection
from app.utils.decorators import token_required
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import logging
import datetime

sessions_blueprint = Blueprint('sessions_blueprint', __name__, url_prefix='/api/users/sessions')
limiter = Limiter(key_func=get_remote_address)
sessions_blueprint.before_request(limiter.check)

@sessions_blueprint.route("", methods=["POST"])
@token_required
@limiter.limit("100 per hour")
def create_session(current_user_id):
    """
    Ya NO se crea la sesión aquí (para evitar duplicados).
    Manejo de sesión está en /auth/login y /auth/verify-2fa.
    Si llamas a este endpoint, devolverá 405.
    """
    return jsonify({
        "error": "Session creation is handled in /auth/login (or /verify-2fa)."
    }), 405

@sessions_blueprint.route("", methods=["GET"])
@token_required
@limiter.limit("100 per hour")
def get_sessions(current_user_id):
    """
    Devuelve las sesiones activas del usuario autenticado.
    Cada sesión: session_id, device, location, login_at
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT session_id, device, location, login_at
                FROM user_sessions
                WHERE user_id = %s
                ORDER BY login_at DESC;
            """, (current_user_id,))
            sessions = cursor.fetchall()
            sessions_list = []
            for s in sessions:
                sessions_list.append({
                    "session_id": s[0],
                    "device": s[1],
                    "location": s[2],
                    "login_at": s[3].isoformat() if s[3] else None
                })
            return jsonify({"sessions": sessions_list}), 200
    except Exception as e:
        logging.error("Error fetching sessions for user_id=%s: %s", current_user_id, e, exc_info=True)
        return jsonify({"error": "Internal server error"}), 500

@sessions_blueprint.route("/<int:session_id>", methods=["DELETE"])
@token_required
@limiter.limit("50 per hour")
def delete_session(current_user_id, session_id):
    """
    Cierra (elimina) una sesión específica.
    Si es la sesión actual, se devuelve 205 para forzar logout en frontend.
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT session_id FROM user_sessions 
                WHERE session_id = %s AND user_id = %s;
            """, (session_id, current_user_id))
            row = cursor.fetchone()
            if not row:
                return jsonify({"error": "Session not found"}), 404

            cursor.execute("DELETE FROM user_sessions WHERE session_id = %s;", (session_id,))
            conn.commit()

            # Si es la sesión actual, devolvemos 205
            if g.get("current_session_id") and int(g.current_session_id) == session_id:
                return jsonify({"message": "Current session closed. Please log out."}), 205
            else:
                return jsonify({"message": "Session closed successfully"}), 200
    except Exception as e:
        logging.error("Error closing session session_id=%s for user_id=%s: %s", session_id, current_user_id, e, exc_info=True)
        return jsonify({"error": "Internal server error"}), 500
