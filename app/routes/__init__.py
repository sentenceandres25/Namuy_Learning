# app/routes/__init__.py

from .users import users_blueprint
from .auth import auth_blueprint
from .interests import interests_blueprint
from .sessionhistory import session_history_blueprint
from .personal_details import personal_details_blueprint
from .account_details import account_details_blueprint
from .profile_picture import profile_picture_blueprint
from .notifications import notifications_blueprint
from .two_factor import two_factor_bp  # **Añade esta línea**

__all__ = [
    'users_blueprint',
    'auth_blueprint',
    'interests_blueprint',
    'session_history_blueprint',
    'personal_details_blueprint',
    'account_details_blueprint',
    'profile_picture_blueprint',
    'notifications_blueprint',
    'two_factor_bp'  # **Añade esta línea**
]
