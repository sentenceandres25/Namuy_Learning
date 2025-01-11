from flask import Blueprint, request, jsonify, current_app
from db.connection import get_db_connection
import pg8000.dbapi
import logging
import json
from werkzeug.utils import secure_filename
import os
from flask_mail import Message

personal_details_blueprint = Blueprint('personal_details_blueprint', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def send_change_request_email(user_id, changes, doc_url):
    mail = current_app.extensions.get('mail')
    if not mail:
        logging.error("Flask-Mail no está configurado correctamente.")
        return

    msg = Message(
        subject="Nueva Solicitud de Cambio Pendiente",
        sender=current_app.config['MAIL_DEFAULT_SENDER'],
        recipients=["namuylearning@gmail.com"]  # Ajusta al correo de tu admin
    )
    msg.body = f"""
    Hola,

    El usuario con ID {user_id} ha solicitado los siguientes cambios:
    {json.dumps(changes, indent=2)}

    Documento adjunto: {doc_url}

    Saludos,
    Equipo de Namuy Learning
    """

    try:
        mail.send(msg)
        logging.info(f"Correo enviado para la solicitud de cambio del usuario {user_id}.")
    except Exception as e:
        logging.error(f"Error al enviar el correo: {e}")

@personal_details_blueprint.route("/<int:user_id>", methods=["GET", "PUT"])
def manage_personal_details(user_id):
    """
    GET: Retorna datos del usuario (JOIN con 'users') => personal_details + info de la cuenta.
    PUT: Actualiza campos que NO requieren aprobación (los que no sean full_name, id_type, etc.).
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
                    "last_update": row[10].isoformat() if row[10] else None,
                    "last_access": row[11].isoformat() if row[11] else None,
                    "pending_approval": row[12],
                    "doc_type": row[13],
                    "doc_url": row[14],
                    "account_status": row[15],
                    "date_joined": row[16].isoformat() if row[16] else None
                }
                return jsonify(data), 200
            else:
                logging.warning(f"Usuario no encontrado: user_id={user_id}")
                return jsonify({"error": "Usuario no encontrado"}), 404
        except Exception as e:
            logging.error(f"Error en GET /personal_details/{user_id}: {e}", exc_info=True)
            return jsonify({"error": "Error interno del servidor"}), 500
        finally:
            conn.close()

    elif request.method == "PUT":
        # Aquí actualizamos SOLO campos que NO requieren aprobación
        if not request.is_json:
            logging.warning(f"PUT /personal_details/{user_id} sin JSON")
            conn.close()
            return jsonify({"error": "Content-Type debe ser 'application/json'"}), 415

        data_req = request.get_json()
        if not data_req:
            conn.close()
            return jsonify({"error": "No se proporcionaron datos"}), 400

        logging.info(f"PUT /personal_details/{user_id} con data: {data_req}")

        # Campos permitidos
        updatable_fields = [
            'email',  # email en personal_details (OJO: no es el principal)
            'alt_email',
            'contact_number',
            'birth_date',
            'country_of_residence'
        ]
        # Los que requieren aprobación se manejan en /requestChange => full_name, id_type, id_number, student_id

        auto_update_changes = {}
        for key, value in data_req.items():
            if key in updatable_fields:
                auto_update_changes[key] = value
            else:
                logging.warning(f"Campo no reconocido o requiere aprobación: {key}")
                conn.close()
                return jsonify({"error": f"Campo no reconocido o no actualizable: {key}"}), 400

        if not auto_update_changes:
            conn.close()
            return jsonify({"error": "No se proporcionaron campos válidos"}), 400

        try:
            updates = [f"{k} = %s" for k in auto_update_changes.keys()]
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

            row = cursor.fetchone()
            if not row:
                conn.rollback()
                logging.warning(f"No se encontró personal_details para user_id={user_id}")
                return jsonify({"error": "Usuario no encontrado"}), 404

            conn.commit()

            updated_response = {
                "full_name": row[0],
                "student_id": row[1],
                "email": row[2],
                "alt_email": row[3],
                "contact_number": row[4],
                "id_type": row[5],
                "id_number": row[6],
                "birth_date": row[7].isoformat() if row[7] else None,
                "country_of_residence": row[8],
                "last_update": row[9].isoformat() if row[9] else None,
                "last_access": row[10].isoformat() if row[10] else None,
                "pending_approval": row[11],
                "doc_type": row[12],
                "doc_url": row[13]
            }
            return jsonify(updated_response), 200

        except pg8000.dbapi.IntegrityError as e:
            conn.rollback()
            logging.error(f"IntegrityError en PUT personal_details user_id={user_id}: {e}", exc_info=True)
            return jsonify({"error": "Email en personal_details ya está en uso"}), 409
        except Exception as e:
            conn.rollback()
            logging.error(f"Error en PUT personal_details user_id={user_id}: {e}", exc_info=True)
            return jsonify({"error": "Error interno del servidor"}), 500
        finally:
            conn.close()

@personal_details_blueprint.route("/<int:user_id>/requestChange", methods=["POST"])
def request_change(user_id):
    """
    Procesa la subida de archivo y campos 'aprobables' (full_name, id_type, id_number, student_id).
    Guarda en change_requests, marca pending_approval, etc.
    """
    if 'file' not in request.files:
        return jsonify({"error": "No se encontró el archivo 'file'"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No se seleccionó ningún archivo"}), 400
    if not allowed_file(file.filename):
        return jsonify({"error": "Tipo de archivo no permitido (png, jpg, jpeg, pdf)"}), 400

    changes_str = request.form.get('changes')
    if not changes_str:
        return jsonify({"error": "No se proporcionaron cambios"}), 400

    try:
        changes_dict = json.loads(changes_str)
    except json.JSONDecodeError:
        return jsonify({"error": "Los cambios deben ser un JSON válido"}), 400

    # Verificar que sean efectivamente de los approval_fields
    approval_required_fields = ['full_name', 'id_type', 'id_number', 'student_id']
    has_approval_fields = any(field in changes_dict for field in approval_required_fields)
    if not has_approval_fields:
        return jsonify({"error": "No hay campos que requieran aprobación en 'changes'"}), 400

    # Guardar archivo en /uploads/user_<id>/
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
        # Insertar en change_requests
        cursor.execute("""
            INSERT INTO change_requests (user_id, changes, status, created_at)
            VALUES (%s, %s, %s, CURRENT_TIMESTAMP)
            RETURNING request_id;
        """, (user_id, json.dumps(changes_dict), 'pending'))
        request_id = cursor.fetchone()[0]
        logging.info(f"Solicitud de cambio creada: ID={request_id}, user_id={user_id}")

        # Marcar pending_approval en personal_details
        cursor.execute("""
            UPDATE personal_details
            SET pending_approval = TRUE,
                doc_type = %s,
                doc_url = %s
            WHERE user_id = %s
            RETURNING user_id;
        """, ('document', doc_url, user_id))
        row = cursor.fetchone()
        if not row:
            conn.rollback()
            return jsonify({"error": "Usuario no encontrado en personal_details"}), 404

        # Actualizar (o insertar) en user_status si la tienes
        cursor.execute("""
            INSERT INTO user_status (user_id, pending, message)
            VALUES (%s, %s, %s)
            ON CONFLICT (user_id)
            DO UPDATE SET pending = EXCLUDED.pending, message = EXCLUDED.message;
        """, (user_id, True, f'Solicitud #{request_id} pendiente de aprobación.'))

        conn.commit()

        # Enviar correo
        base_url = request.host_url.rstrip('/')
        full_doc_url = f"{base_url}{doc_url}"
        send_change_request_email(user_id, changes_dict, full_doc_url)

        return jsonify({"pending": True,
                        "message": "Solicitud enviada y pendiente de aprobación."}), 200

    except Exception as e:
        conn.rollback()
        logging.error(f"Error en requestChange user_id={user_id}: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@personal_details_blueprint.route("/<int:user_id>/status", methods=["GET"])
def get_user_status(user_id):
    """
    Retorna si el usuario tiene cambios pendientes (user_status).
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT pending, message FROM user_status WHERE user_id = %s;", (user_id,))
        row = cursor.fetchone()
        if row:
            return jsonify({"pending": row[0], "message": row[1]}), 200
        else:
            return jsonify({"pending": False, "message": ""}), 200
    except Exception as e:
        logging.error(f"Error al obtener status user_id={user_id}: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()
