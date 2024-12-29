import bcrypt

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

def check_password(password, hashed_str):
    # hashed_str es un string: '$2b$12$something...'
    return bcrypt.checkpw(password.encode('utf-8'), hashed_str.encode('utf-8'))
