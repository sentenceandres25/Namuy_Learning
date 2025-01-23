# app/utils/validators.py

import re

def validate_user_data(data):
    """
    Valida los datos para la creación de un usuario.
    Retorna un mensaje de error si hay un problema, o None si todo está bien.
    
    Args:
        data (dict): Diccionario que contiene los datos del usuario.
    
    Returns:
        str or None: Mensaje de error si la validación falla, o None si pasa.
    """
    required_fields = ['username', 'email', 'password']
    for field in required_fields:
        if field not in data:
            return f"Falta el campo '{field}'."
        if not data[field]:
            return f"El campo '{field}' no puede estar vacío."
    
    # Validar formato de email utilizando la función validate_email
    if not validate_email(data['email']):
        return "Formato de email inválido."
    
    # Validar longitud de contraseña
    if len(data['password']) < 6:
        return "La contraseña debe tener al menos 6 caracteres."
    
    # Si se proporcionan, validar número de teléfono y correo electrónico alternativo
    if 'contact_number' in data and data['contact_number']:
        if not validate_phone_number(data['contact_number']):
            return "Formato de número de teléfono inválido."
    
    if 'alt_email' in data and data['alt_email']:
        if not validate_email(data['alt_email']):
            return "Formato de correo electrónico alternativo inválido."
    
    return None

def validate_email(email):
    """
    Valida el formato del correo electrónico.
    
    Args:
        email (str): Correo electrónico a validar.
    
    Returns:
        bool: True si el formato es válido, False de lo contrario.
    """
    email_regex = r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    return re.match(email_regex, email) is not None

def validate_phone_number(phone_number):
    """
    Valida el formato del número de teléfono.
    
    Args:
        phone_number (str): Número de teléfono a validar.
    
    Returns:
        bool: True si el formato es válido (E.164), False de lo contrario.
    """
    phone_regex = r'^\+?[1-9]\d{1,14}$'  # Formato E.164
    return re.match(phone_regex, phone_number) is not None
