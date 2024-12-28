# db/connection.py

import pg8000

def get_db_connection():
    return pg8000.connect(
        host="localhost",
        database="namuy_learning",
        user="postgres",
        password="JaOb019640.",
        port=5432
    )
