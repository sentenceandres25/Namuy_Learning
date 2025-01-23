from flask import Blueprint, request, jsonify
from app.db.connection import get_db_connection
from app.utils.hash_utils import hash_password
from app.utils.validators import validate_user_data
from app.utils.decorators import token_required
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import pg8000.dbapi
import logging

# Initialize the Blueprint for user-related routes
users_blueprint = Blueprint('users_blueprint', __name__)

# Apply rate limiting to the Blueprint
limiter = Limiter(key_func=get_remote_address)

@users_blueprint.route("", methods=["POST"])
@limiter.limit("10 per minute")  # Example: Limit to 10 requests per minute
def create_user():
    """
    Create a new user in the 'users' table and a corresponding record in 'personal_details'.
    Password is hashed using bcrypt and stored in 'password_hash'.
    """
    data = request.get_json()
    
    # Validate the incoming user data
    validation_error = validate_user_data(data)
    if validation_error:
        return jsonify({"error": validation_error}), 400

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # Hash the user's password
            hashed_bytes = hash_password(data['password'])  # bcrypt returns bytes
            hashed_str = hashed_bytes.decode('utf-8')

            # Set default preferred language to 'es' if not 'en' or 'es'
            preferred_language = data.get('preferred_language', 'es')
            if preferred_language not in ['en', 'es']:
                preferred_language = 'es'

            # Insert the new user into the 'users' table
            cursor.execute("""
                INSERT INTO users (username, email, password_hash, preferred_language)
                VALUES (%s, %s, %s, %s)
                RETURNING user_id, username, email, date_joined, preferred_language;
            """, (data['username'], data['email'], hashed_str, preferred_language))
            user_row = cursor.fetchone()
            user_id = user_row[0]

            # Create a corresponding record in 'personal_details'
            cursor.execute("""
                INSERT INTO personal_details (user_id, full_name, student_id, email)
                VALUES (%s, %s, %s, %s)
                RETURNING personal_detail_id;
            """, (
                user_id,
                data.get('full_name', ''),
                data.get('student_id', ''),
                data['email']
            ))
            personal_detail_id = cursor.fetchone()[0]

            # Commit the transaction
            conn.commit()

            # Prepare the response data
            user_data = {
                "user_id": user_id,
                "username": user_row[1],
                "email": user_row[2],
                "date_joined": user_row[3].isoformat(),
                "preferred_language": user_row[4],
                "personal_detail_id": personal_detail_id
            }
            return jsonify(user_data), 201

    except pg8000.dbapi.IntegrityError:
        # Handle duplicate email or username
        conn.rollback()
        return jsonify({"error": "Email or username already in use"}), 409
    except Exception as e:
        # Log unexpected errors
        logging.error(f"Error in create_user: {e}", exc_info=True)
        conn.rollback()
        return jsonify({"error": "Internal server error"}), 500
    finally:
        conn.close()


@users_blueprint.route("/preferred-language", methods=["GET"])
@token_required
@limiter.limit("100 per hour")  # Example: Limit to 100 requests per hour
def get_preferred_language(current_user_id):
    """
    Retrieve the preferred language of the authenticated user.
    """
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT preferred_language FROM users WHERE user_id = %s;", (current_user_id,))
            row = cursor.fetchone()
            if row:
                return jsonify({"preferredLanguage": row[0]}), 200
            else:
                return jsonify({"error": "User not found"}), 404
    except Exception as e:
        logging.error(f"Error in /preferred-language (GET): {e}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500
    finally:
        conn.close()


@users_blueprint.route("/preferred-language", methods=["PUT"])
@token_required
@limiter.limit("50 per hour")  # Example: Limit to 50 requests per hour
def update_preferred_language(current_user_id):
    """
    Update the preferred language of the authenticated user.
    """
    data = request.get_json()
    preferred_language = data.get('preferredLanguage')

    # Validate the preferred language
    if not preferred_language or preferred_language not in ['en', 'es']:
        return jsonify({"error": "Invalid language"}), 400

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                UPDATE users
                SET preferred_language = %s
                WHERE user_id = %s
                RETURNING preferred_language;
            """, (preferred_language, current_user_id))
            row = cursor.fetchone()
            if row:
                conn.commit()
                return jsonify({
                    "message": "Preferred language updated successfully",
                    "preferredLanguage": row[0]
                }), 200
            else:
                conn.rollback()
                return jsonify({"error": "User not found"}), 404
    except Exception as e:
        logging.error(f"Error in /preferred-language (PUT): {e}", exc_info=True)
        conn.rollback()
        return jsonify({"error": "Internal server error"}), 500
    finally:
        conn.close()


@users_blueprint.route("/<int:user_id>/email", methods=["PUT"])
@token_required
@limiter.limit("30 per hour")  # Example: Limit to 30 requests per hour
def update_user_email(current_user_id, user_id):
    """
    Update the primary email in the 'users' table.
    - Ensures that user_id matches current_user_id (prevents unauthorized access).
    - If the email already exists for another user, returns a 409 Conflict.
    - If the email is the same for the current user, no conflict occurs.
    """
    # Verify that the user is updating their own email
    if current_user_id != user_id:
        return jsonify({"error": "Unauthorized access"}), 403

    data = request.get_json()
    new_email = data.get('email')

    # Validate the new email
    if not new_email:
        return jsonify({"error": "New email is required"}), 400

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # Check if the new email already exists for another user
            cursor.execute("SELECT user_id FROM users WHERE email = %s", (new_email,))
            row = cursor.fetchone()
            if row and row[0] != user_id:
                return jsonify({"error": "This email is already in use"}), 409

            # Update the email in the 'users' table
            cursor.execute("""
                UPDATE users
                SET email = %s
                WHERE user_id = %s
                RETURNING user_id, username, email;
            """, (new_email, user_id))
            updated_row = cursor.fetchone()
            if not updated_row:
                conn.rollback()
                return jsonify({"error": "User not found"}), 404

            # Commit the transaction
            conn.commit()

            return jsonify({
                "message": "Primary email updated successfully",
                "user_id": updated_row[0],
                "username": updated_row[1],
                "email": updated_row[2]
            }), 200

    except Exception as e:
        logging.error(f"Error updating email for user_id={user_id}: {e}", exc_info=True)
        conn.rollback()
        return jsonify({"error": "Internal server error"}), 500
    finally:
        conn.close()
