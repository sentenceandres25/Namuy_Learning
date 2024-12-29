import bcrypt

# Contraseña deseada
new_password = "pas123"

# Generar hash (bytes)
hashed_bytes = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
# Convertirlo a string
hashed_str = hashed_bytes.decode('utf-8')

print(hashed_str)
