# app/db/connection.py

from psycopg2 import pool
from contextlib import contextmanager
from app.config import Config
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    # Inicializar el pool de conexiones
    db_pool = pool.SimpleConnectionPool(
        minconn=1,
        maxconn=20,  # Ajusta este valor según las necesidades de tu aplicación y la capacidad de tu DB
        user=Config.DB_USER,
        password=Config.DB_PASSWORD,
        host=Config.DB_HOST,
        port=Config.DB_PORT,
        database=Config.DB_NAME
    )
    logger.info("Database connection pool created successfully.")
except Exception as e:
    logger.error(f"Error creating database connection pool: {e}", exc_info=True)
    raise

@contextmanager
def get_db_connection():
    """
    Context manager para obtener una conexión del pool y asegurar que se devuelva al finalizar.
    
    Yields:
        conn: Objeto de conexión a la base de datos.
    """
    conn = None
    try:
        conn = db_pool.getconn()
        yield conn
    except Exception as e:
        logger.error(f"Error obtaining database connection: {e}", exc_info=True)
        raise
    finally:
        if conn:
            db_pool.putconn(conn)
