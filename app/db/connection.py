# app/db/connection.py

from psycopg2 import pool
from app.config import Config
import logging

try:
    db_pool = pool.SimpleConnectionPool(
        minconn=1,
        maxconn=20,
        user=Config.DB_USER,
        password=Config.DB_PASSWORD,
        host=Config.DB_HOST,
        port=Config.DB_PORT,
        database=Config.DB_NAME
    )
    logging.info("Database connection pool created successfully.")
except Exception as e:
    logging.error(f"Error creating database connection pool: {e}", exc_info=True)
    raise

def get_db_connection():
    """
    Retrieves a connection from the pool.
    """
    try:
        return db_pool.getconn()
    except Exception as e:
        logging.error(f"Error getting DB connection from pool: {e}", exc_info=True)
        raise

def return_db_connection(conn):
    """
    Returns a connection back to the pool.
    """
    try:
        db_pool.putconn(conn)
    except Exception as e:
        logging.error(f"Error returning DB connection to pool: {e}", exc_info=True)
        raise
