from flask import Blueprint, request, jsonify, current_app
from db.connection import get_db_connection
from utils.hash_utils import hash_password, check_password
from utils.validators import validate_user_data
import pg8000.dbapi
import logging
import json
from werkzeug.utils import secure_filename
import os
from flask_mail import Message

users_blueprint = Blueprint('users', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf'}

def allowed_file(filename):
    """
    Verifica si un nombre de archivo tiene una extensión permitida.
    """
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def send_change_request_email(user_id, changes, doc_url):
    """
    Envía un correo al administrador indicando que hay cambios pendientes de aprobación.
    Incluye la URL local donde se subió el archivo (doc_url).
    """
    mail = current_app.extensions.get('mail')
    if not mail:
        logging.error("Flask-Mail no está configurado correctamente.")
        return

    msg = Message(
        subject="Nueva Solicitud de Cambio Pendiente de Aprobación",
        sender=current_app.config['MAIL_DEFAULT_SENDER'],
        recipients=["namuylearning@gmail.com"]  # Cambiar al correo de tu admin
    )

    msg.body = f"""
    Hola,

    El usuario con ID {user_id} ha solicitado los siguientes cambios:
    {json.dumps(changes, indent=2)}

    Por favor, revisa el documento de identificación en el siguiente enlace:
    {doc_url}

    Saludos,
    Equipo de Namuylearning
    """

    try:
        mail.send(msg)
        logging.info(f"Correo enviado para la solicitud de cambio del usuario {user_id}.")
    except Exception as e:
        logging.error(f"Error al enviar el correo: {e}")


@users_blueprint.route("", methods=["POST"])
def create_user():
    """
    Crea un nuevo usuario en la tabla 'users' y su registro inicial en 'personal_details'.
    - Hashea la contraseña con bcrypt y la almacena como texto (formato $2b$...).
    """
    data = request.get_json()
    validation_error = validate_user_data(data)
    if validation_error:
        return jsonify({"error": validation_error}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Hashear la contraseña con bcrypt y decodificar a str para la BD
        hashed_bytes = hash_password(data['password'])  # bcrypt retorna bytes
        hashed_str = hashed_bytes.decode('utf-8')       # Guardamos como str '$2b$12$...'

        cursor.execute("""
            INSERT INTO users (username, email, password_hash)
            VALUES (%s, %s, %s)
            RETURNING user_id, username, email, date_joined;
        """, (data['username'], data['email'], hashed_str))

        user_row = cursor.fetchone()
        user_id = user_row[0]

        # Crear registro inicial en personal_details
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

        conn.commit()

        user_data = {
            "user_id": user_id,
            "username": user_row[1],
            "email": user_row[2],
            "date_joined": user_row[3].isoformat(),
            "personal_detail_id": personal_detail_id
        }
        return jsonify(user_data), 201

    except pg8000.dbapi.IntegrityError:
        conn.rollback()
        return jsonify({"error": "Email o nombre de usuario ya registrado"}), 409
    except Exception as e:
        conn.rollback()
        logging.error(f"Error en create_user: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@users_blueprint.route("/<int:user_id>", methods=["GET", "PUT"])
def manage_user(user_id):
    """
    GET: Trae datos del usuario y su info personal (JOIN con 'users' para ver account_status, date_joined, etc).
    PUT: Actualiza campos en personal_details (si requieren aprobación se marcan pending).
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    if request.method == "GET":
        try:
            cursor.execute("""
                SELECT 
                    u.user_id,
                    p.full_name,
                    p.student_id,
                    p.email,
                    p.alt_email,
                    p.contact_number,
                    p.id_type,
                    p.id_number,
                    p.birth_date,
                    p.country_of_residence,
                    p.last_update,
                    p.last_access,
                    p.pending_approval,
                    p.doc_type,
                    p.doc_url,
                    u.account_status,
                    u.date_joined
                FROM personal_details p
                JOIN users u ON p.user_id = u.user_id
                WHERE p.user_id = %s;
            """, (user_id,))
            row = cursor.fetchone()
            if row:
                data = {
                    "user_id": row[0],
                    "full_name": row[1],
                    "student_id": row[2],
                    "email": row[3],
                    "alt_email": row[4],
                    "contact_number": row[5],
                    "id_type": row[6],
                    "id_number": row[7],
                    "birth_date": row[8].isoformat() if row[8] else None,
                    "country_of_residence": row[9],
                    "last_update": row[10].isoformat(),
                    "last_access": row[11].isoformat() if row[11] else None,
                    "pending_approval": row[12],
                    "doc_type": row[13],
                    "doc_url": row[14],
                    "account_status": row[15],
                    "date_joined": row[16].isoformat() if row[16] else None
                }
                return jsonify(data), 200
            else:
                logging.warning(f"Usuario no encontrado: user_id {user_id}")
                return jsonify({"error": "Usuario no encontrado"}), 404

        except Exception as e:
            logging.error(f"Error en GET manage_user para user_id {user_id}: {e}", exc_info=True)
            return jsonify({"error": "Error interno del servidor"}), 500

    elif request.method == "PUT":
        # Verificar Content-Type y JSON
        if not request.is_json:
            logging.warning(f"PUT /api/user/{user_id} sin Content-Type 'application/json'")
            return jsonify({"error": "Content-Type debe ser 'application/json'"}), 415

        data = request.get_json()
        if not data:
            logging.warning(f"PUT /api/user/{user_id} sin datos JSON")
            return jsonify({"error": "No se proporcionaron datos"}), 400

        logging.info(f"Datos recibidos para actualización de user_id {user_id}: {data}")

        # Definir campos
        updatable_fields = ['email', 'alt_email', 'contact_number', 'birth_date', 'country_of_residence']
        approval_fields = ['full_name', 'id_type', 'id_number', 'student_id']

        auto_update_changes = {}
        approval_required_changes = {}

        for key, value in data.items():
            if key in updatable_fields:
                auto_update_changes[key] = value
            elif key in approval_fields:
                approval_required_changes[key] = value
            else:
                logging.warning(f"Campo no reconocido en actualización: {key}")
                return jsonify({"error": f"Campo no reconocido: {key}"}), 400

        if not auto_update_changes and not approval_required_changes:
            logging.warning("No se proporcionaron campos válidos para actualizar")
            return jsonify({"error": "No se proporcionaron campos válidos para actualizar"}), 400

        try:
            # Actualizar campos que no requieren aprobación
            if auto_update_changes:
                updates = [f"{field} = %s" for field in auto_update_changes.keys()]
                set_clause = ", ".join(updates)
                values = list(auto_update_changes.values())
                values.append(user_id)

                cursor.execute(f"""
                    UPDATE personal_details
                    SET {set_clause}, last_update = CURRENT_DATE
                    WHERE user_id = %s
                    RETURNING full_name, student_id, email, alt_email, contact_number,
                              id_type, id_number, birth_date, country_of_residence,
                              last_update, last_access, pending_approval, doc_type, doc_url;
                """, tuple(values))

                updated_row = cursor.fetchone()
                if updated_row:
                    updated_data = {
                        "full_name": updated_row[0],
                        "student_id": updated_row[1],
                        "email": updated_row[2],
                        "alt_email": updated_row[3],
                        "contact_number": updated_row[4],
                        "id_type": updated_row[5],
                        "id_number": updated_row[6],
                        "birth_date": updated_row[7].isoformat() if updated_row[7] else None,
                        "country_of_residence": updated_row[8],
                        "last_update": updated_row[9].isoformat(),
                        "last_access": updated_row[10].isoformat() if updated_row[10] else None,
                        "pending_approval": updated_row[11],
                        "doc_type": updated_row[12],
                        "doc_url": updated_row[13]
                    }
                    logging.info(f"Datos actualizados para user_id {user_id}: {updated_data}")
                else:
                    logging.error(f"Usuario no encontrado para actualizar: {user_id}")
                    return jsonify({"error": "Usuario no encontrado"}), 404

            # Actualizar campos que requieren aprobación
            if approval_required_changes:
                logging.info(f"Campos que requieren aprobación para user_id {user_id}: {approval_required_changes}")
                changes_json = json.dumps(approval_required_changes)

                cursor.execute("""
                    INSERT INTO change_requests (user_id, changes, status, created_at)
                    VALUES (%s, %s, %s, CURRENT_TIMESTAMP)
                    RETURNING request_id;
                """, (user_id, changes_json, 'pending'))
                request_id = cursor.fetchone()[0]
                logging.info(f"Solicitud de cambio creada con ID: {request_id} para user_id: {user_id}")

                # Marcar 'pending_approval' en personal_details
                cursor.execute("""
                    UPDATE personal_details
                    SET pending_approval = TRUE
                    WHERE user_id = %s;
                """, (user_id,))

            conn.commit()

            # Consulta final (JOIN con users) para retornar todo actualizado
            cursor.execute("""
                SELECT 
                    u.user_id,
                    p.full_name,
                    p.student_id,
                    p.email,
                    p.alt_email,
                    p.contact_number,
                    p.id_type,
                    p.id_number,
                    p.birth_date,
                    p.country_of_residence,
                    p.pending_approval,
                    p.doc_type,
                    p.doc_url,
                    u.account_status,
                    u.date_joined
                FROM personal_details p
                JOIN users u ON p.user_id = u.user_id
                WHERE p.user_id = %s;
            """, (user_id,))
            row = cursor.fetchone()
            if not row:
                logging.error(f"Detalles personales no encontrados tras la actualización: user_id {user_id}")
                return jsonify({"error": "Detalles personales no encontrados"}), 404

            updated_details = {
                "user_id": row[0],
                "full_name": row[1],
                "student_id": row[2],
                "email": row[3],
                "alt_email": row[4],
                "contact_number": row[5],
                "id_type": row[6],
                "id_number": row[7],
                "birth_date": row[8].isoformat() if row[8] else None,
                "country_of_residence": row[9],
                "pending_approval": row[10],
                "doc_type": row[11],
                "doc_url": row[12],
                "account_status": row[13],
                "date_joined": row[14].isoformat() if row[14] else None
            }
            logging.info(f"Datos final actualizados para user_id {user_id}: {updated_details}")

            return jsonify(updated_details), 200

        except pg8000.dbapi.IntegrityError as e:
            conn.rollback()
            logging.error(f"IntegrityError al actualizar user_id {user_id}: {e}", exc_info=True)
            return jsonify({"error": "Email ya registrado"}), 409
        except Exception as e:
            conn.rollback()
            logging.error(f"Error al actualizar user_id {user_id}: {e}", exc_info=True)
            return jsonify({"error": "Error interno del servidor", "details": str(e)}), 500
        finally:
            conn.close()


@users_blueprint.route("/<int:user_id>/status", methods=["GET"])
def get_user_status(user_id):
    """
    Ver estado pending o no del usuario en la tabla user_status.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT pending, message FROM user_status WHERE user_id = %s;", (user_id,))
        row = cursor.fetchone()
        if row:
            status = {
                "pending": row[0],
                "message": row[1]
            }
            return jsonify(status), 200
        else:
            return jsonify({"pending": False, "message": ""}), 200
    except Exception as e:
        logging.error(f"Error al obtener status para user_id {user_id}: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@users_blueprint.route("/<int:user_id>/requestChange", methods=["POST"])
def request_change(user_id):
    """
    Procesa la subida de archivo y campos 'aprobables'.
    """
    if 'file' not in request.files:
        return jsonify({"error": "No se encontró el archivo en la solicitud"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No se seleccionó ningún archivo"}), 400
    if not allowed_file(file.filename):
        return jsonify({"error": "Tipo de archivo no permitido. Tipos permitidos: png, jpg, jpeg, pdf"}), 400

    changes = request.form.get('changes')
    if not changes:
        return jsonify({"error": "No se proporcionaron cambios"}), 400

    try:
        changes_dict = json.loads(changes)
    except json.JSONDecodeError:
        return jsonify({"error": "Los cambios deben ser un JSON válido"}), 400

    # Verificar si se requieren campos con aprobación
    approval_required_fields = ['full_name', 'id_type', 'id_number', 'student_id']
    has_approval_fields = any(field in changes_dict for field in approval_required_fields)
    if has_approval_fields and not file:
        return jsonify({"error": "Se requiere un documento de identidad para cambios que requieren aprobación"}), 400

    filename = secure_filename(file.filename)
    upload_folder = os.path.join(current_app.root_path, 'uploads')
    user_upload_folder = os.path.join(upload_folder, f"user_{user_id}")
    os.makedirs(user_upload_folder, exist_ok=True)
    file_path = os.path.join(user_upload_folder, f"request_{filename}")
    file.save(file_path)

    doc_url = f"/uploads/user_{user_id}/request_{filename}"

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO change_requests (user_id, changes, status, created_at)
            VALUES (%s, %s, %s, CURRENT_TIMESTAMP)
            RETURNING request_id;
        """, (user_id, changes_dict, 'pending'))
        request_id = cursor.fetchone()[0]
        logging.info(f"Solicitud de cambio creada con ID: {request_id} para user_id: {user_id}")

        # Actualizar user_status
        cursor.execute("""
            INSERT INTO user_status (user_id, pending, message)
            VALUES (%s, %s, %s)
            ON CONFLICT (user_id)
            DO UPDATE SET pending = EXCLUDED.pending, message = EXCLUDED.message;
        """, (user_id, True, f'Solicitud de cambio #{request_id} pendiente de aprobación.'))

        # Marcar pending_approval en personal_details si hay campos de aprobación
        if has_approval_fields:
            cursor.execute("""
                UPDATE personal_details
                SET pending_approval = TRUE,
                    doc_type = %s,
                    doc_url = %s
                WHERE user_id = %s;
            """, ('document', doc_url, user_id))

        conn.commit()

        # Enviar correo
        base_url = request.host_url.rstrip('/')
        full_doc_url = f"{base_url}{doc_url}"
        send_change_request_email(user_id, changes_dict, full_doc_url)

        return jsonify({"pending": True, "message": "Solicitud enviada y pendiente de aprobación."}), 200

    except Exception as e:
        conn.rollback()
        logging.error(f"Error al insertar cambio en change_requests para user_id {user_id}: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@users_blueprint.route("/<int:user_id>/updatePassword", methods=["PUT"])
def update_password(user_id):
    """
    Actualiza la contraseña de un usuario específico.
    Espera { "newPassword": "..." } en el body JSON.
    """
    if not request.is_json:
        return jsonify({"error": "Content-Type debe ser 'application/json'"}), 415
    
    data = request.get_json()
    new_password = data.get('newPassword')
    if not new_password:
        return jsonify({"error": "No se proporcionó la nueva contraseña"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Hashear la nueva contraseña con bcrypt
        hashed_bytes = hash_password(new_password)
        hashed_str = hashed_bytes.decode('utf-8')

        cursor.execute("""
            UPDATE users
            SET password_hash = %s
            WHERE user_id = %s
            RETURNING user_id;
        """, (hashed_str, user_id))
        updated = cursor.fetchone()
        if not updated:
            conn.rollback()
            return jsonify({"error": "Usuario no encontrado"}), 404

        conn.commit()
        return jsonify({"message": "Contraseña actualizada exitosamente"}), 200

    except Exception as e:
        conn.rollback()
        logging.error(f"Error al actualizar contraseña user_id {user_id}: {e}", exc_info=True)
        return jsonify({"error": "Error interno del servidor"}), 500
    finally:
        conn.close()
