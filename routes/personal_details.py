# routes/personal_details.py

from flask import Blueprint, request, jsonify, current_app
from db.connection import get_db_connection
import pg8000.dbapi
import logging
import json
from werkzeug.utils import secure_filename
import os
from flask_mail import Message

# Nota: aquí asumo que allowed_file y send_change_request_email se definen igual.
# Podrías importarlos de un utils.py si lo prefieres.
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def send_change_request_email(user_id, changes, doc_url):
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


# Creamos el nuevo blueprint
personal_details_blueprint = Blueprint('personal_details_blueprint', __name__)

@personal_details_blueprint.route("/<int:user_id>", methods=["GET", "PUT"])
def manage_personal_details(user_id):
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
            logging.error(f"Error en GET manage_personal_details para user_id {user_id}: {e}", exc_info=True)
            return jsonify({"error": "Error interno del servidor"}), 500

    elif request.method == "PUT":
        if not request.is_json:
            logging.warning(f"PUT /api/personal_details/{user_id} sin Content-Type 'application/json'")
            return jsonify({"error": "Content-Type debe ser 'application/json'"}), 415

        data = request.get_json()
        if not data:
            logging.warning(f"PUT /api/personal_details/{user_id} sin datos JSON")
            return jsonify({"error": "No se proporcionaron datos"}), 400

        logging.info(f"Datos recibidos para actualización de user_id {user_id}: {data}")

        # Campos que se pueden actualizar directamente
        updatable_fields = ['email', 'alt_email', 'contact_number', 'birth_date', 'country_of_residence']
        # Campos que requieren aprobación
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
            # Actualizar campos que NO requieren aprobación
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
                if not updated_row:
                    logging.error(f"Usuario no encontrado para actualizar: {user_id}")
                    conn.rollback()
                    return jsonify({"error": "Usuario no encontrado"}), 404

            # Actualizar campos que SÍ requieren aprobación
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

            # Consulta final para retornar todo actualizado (JOIN con users)
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

@personal_details_blueprint.route("/<int:user_id>/status", methods=["GET"])
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

@personal_details_blueprint.route("/<int:user_id>/requestChange", methods=["POST"])
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

    # Verificar campos que requieren aprobación
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
