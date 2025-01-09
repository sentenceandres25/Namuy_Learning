# db/connection.py

import pg8000
import os
import logging

def get_db_connection():
    """
    Retorna una conexión a la base de datos.
    """
    try:
        conn = pg8000.connect(
            user=os.getenv('DB_USER', 'postgres'),
            password=os.getenv('DB_PASSWORD', 'JaOb019640.'),
            host=os.getenv('DB_HOST', 'localhost'),
            port=int(os.getenv('DB_PORT', 5432)),
            database=os.getenv('DB_NAME', 'namuy_learning')
        )
        return conn
    except Exception as e:
        logging.error(f"Error al conectar a la base de datos: {e}", exc_info=True)
        raise
