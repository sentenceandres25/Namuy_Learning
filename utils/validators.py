# utils/validators.py

import re

def validate_user_data(data):
    """
    Valida los datos para la creación de un usuario.
    Retorna un mensaje de error si hay un problema, o None si todo está bien.
    """
    required_fields = ['username', 'email', 'password']
    for field in required_fields:
        if field not in data:
            return f"Falta el campo '{field}'."
        if not data[field]:
            return f"El campo '{field}' no puede estar vacío."
    
    # Validar formato de email
    email_regex = r"[^@]+@[^@]+\.[^@]+"
    if not re.match(email_regex, data['email']):
        return "Formato de email inválido."
    
    # Validar longitud de contraseña
    if len(data['password']) < 6:
        return "La contraseña debe tener al menos 6 caracteres."
    
    return None
