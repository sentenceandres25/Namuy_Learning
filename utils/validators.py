# utils/validators.py

def validate_user_data(data):
    required_fields = ['username', 'email', 'password']
    for field in required_fields:
        if field not in data or not data[field]:
            return f"{field} is required."
    if len(data['password']) < 6:
        return "Password must be at least 6 characters long."
    return None
