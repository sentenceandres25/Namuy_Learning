# utils/hash_utils.py

import bcrypt

def hash_password(password):
    """
    Hashea una contraseña utilizando bcrypt.
    Retorna el hash en bytes.
    """
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

def check_password(password, hashed_str):
    """
    Verifica una contraseña contra un hash.
    Retorna True si coincide, False de lo contrario.
    """
    # hashed_str es un string: '$2b$12$something...'
    return bcrypt.checkpw(password.encode('utf-8'), hashed_str.encode('utf-8'))
