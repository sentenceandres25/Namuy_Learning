from flask import Blueprint, request, jsonify, current_app, g
from app.db.connection import get_db_connection
from app.utils.decorators import token_required
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import jwt, datetime, logging
from app.utils.hash_utils import verify_password

auth_blueprint = Blueprint('auth_blueprint', __name__, url_prefix='/api/auth')
limiter = Limiter(key_func=get_remote_address)
auth_blueprint.before_request(limiter.check)

@auth_blueprint.route("/login", methods=["POST"])
@limiter.limit("20 per minute")
def login_endpoint():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"error": "Missing credentials"}), 400
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT user_id, password_hash, username FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()
            if not user:
                return jsonify({"error": "User not found"}), 404
            user_id, password_hash, username = user
            if not verify_password(password, password_hash):
                return jsonify({"error": "Incorrect password"}), 401

            # Datos del dispositivo/ubicación
            device = request.headers.get("X-Device-Info", "Unknown Device")
            location = request.remote_addr or "Unknown Location"

            # Antes se hacía INSERT directo; ahora verificamos si ya existe la sesión
            cursor.execute("""
                SELECT session_id, login_at
                FROM user_sessions
                WHERE user_id = %s AND device = %s
                ORDER BY login_at DESC
                LIMIT 1;
            """, (user_id, device))
            existing_session = cursor.fetchone()

            if existing_session:
                # Reutilizar sesión
                session_id, old_login_at = existing_session
                now = datetime.datetime.utcnow()
                cursor.execute("""
                    UPDATE user_sessions
                    SET location = %s, login_at = %s
                    WHERE session_id = %s
                    RETURNING session_id, login_at;
                """, (location, now, session_id))
                row = cursor.fetchone()
                session_id = row[0]
                login_at = row[1]
            else:
                # Crear nueva sesión
                cursor.execute("""
                    INSERT INTO user_sessions (user_id, device, location)
                    VALUES (%s, %s, %s)
                    RETURNING session_id, login_at;
                """, (user_id, device, location))
                row = cursor.fetchone()
                session_id = row[0]
                login_at = row[1]

            # Crear el token JWT incluyendo user_id y session_id
            payload = {
                "user_id": user_id,
                "session_id": session_id,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
            }
            token = jwt.encode(payload, current_app.config['JWT_SECRET_KEY'], algorithm="HS256")
            conn.commit()

            # NOTA: si tuvieras lógica 2FA, aquí pondrías la verificación 
            # y/o retornarías algo distinto; se ha omitido para simplificar.

            return jsonify({
                "user_id": user_id,
                "username": username,
                "token": token,
                "session_id": session_id,
                "last_access": login_at.isoformat() if login_at else None
            }), 200
    except Exception as e:
        logging.error("Error in login: %s", e, exc_info=True)
        return jsonify({"error": "Internal server error"}), 500

@auth_blueprint.route("/refresh", methods=["POST"])
@token_required
def refresh_token(current_user_id):
    try:
        # Utilizar el session_id almacenado en el contexto global
        session_id = g.get("current_session_id")
        if not session_id:
            return jsonify({"error": "Session information missing."}), 401

        payload = {
            "user_id": current_user_id,
            "session_id": session_id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }
        new_token = jwt.encode(payload, current_app.config['JWT_SECRET_KEY'], algorithm="HS256")
        return jsonify({"token": new_token}), 200
    except Exception as e:
        logging.error(f"Error refreshing token: {e}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500
