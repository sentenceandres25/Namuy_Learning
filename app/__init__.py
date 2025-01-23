# app/__init__.py

import os
import logging
from logging.handlers import RotatingFileHandler
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_mail import Mail
from flask_migrate import Migrate
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv

# Import extensions
from app.extensions import db, mail

def create_app():
    """
    Application factory function to create and configure the Flask app.
    """
    # Load environment variables from .env file
    load_dotenv()

    # Create the Flask application instance
    app = Flask(__name__)

    # Configure the app using environment variables
    configure_app(app)

    # Initialize Flask extensions
    initialize_extensions(app)

    # Configure CORS to allow requests from specified origins
    configure_cors(app)

    # Set up rate limiting to protect against abuse
    configure_rate_limiting(app)

    # Configure logging for better observability and debugging
    configure_logging(app)

    # Import and register Blueprints with API versioning
    register_blueprints(app)

    # Add additional routes and error handlers
    add_additional_routes(app)
    register_error_handlers(app)

    return app

def configure_app(app):
    """
    Configures the Flask application using environment variables.
    """
    # Database configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Flask-Mail configuration
    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
    app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True') == 'True'
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', app.config['MAIL_USERNAME'])
    app.config['MAIL_DEFAULT_CHARSET'] = 'utf-8'

    # JWT configuration
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

    # Storage configuration
    app.config['STORAGE_TYPE'] = os.getenv('STORAGE_TYPE', 'local')

    # Rate Limiting configuration (default limits)
    app.config['RATELIMIT_DEFAULT'] = os.getenv('RATELIMIT_DEFAULT', '200 per day;50 per hour')
    app.config['RATELIMIT_STORAGE_URI'] = os.getenv('RATELIMIT_STORAGE_URI', 'memory://')

    # SMTP configurations for email_utils
    app.config['SMTP_SERVER'] = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    app.config['SMTP_PORT'] = int(os.getenv('SMTP_PORT', 587))
    app.config['SMTP_USERNAME'] = os.getenv('SMTP_USERNAME')
    app.config['SMTP_PASSWORD'] = os.getenv('SMTP_PASSWORD')
    app.config['FROM_EMAIL'] = os.getenv('FROM_EMAIL', app.config['MAIL_USERNAME'])

    # Two-Factor Authentication configurations
    app.config['TWO_FACTOR_CODE_EXPIRY_MINUTES'] = int(os.getenv('TWO_FACTOR_CODE_EXPIRY_MINUTES', 10))
    app.config['TWO_FACTOR_MAX_ATTEMPTS'] = int(os.getenv('TWO_FACTOR_MAX_ATTEMPTS', 5))

def initialize_extensions(app):
    """
    Initializes Flask extensions with the app instance.
    """
    # Initialize SQLAlchemy
    db.init_app(app)

    # Initialize Flask-Mail
    mail.init_app(app)

    # Initialize Flask-Migrate for database migrations
    migrate = Migrate(app, db)

def configure_cors(app):
    """
    Configures Cross-Origin Resource Sharing (CORS) for the Flask app.
    """
    CORS(
        app,
        resources={r"/api/*": {"origins": "http://localhost:3000"}},
        supports_credentials=True,
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"]
    )

def configure_rate_limiting(app):
    """
    Configures rate limiting using Flask-Limiter to protect against abuse.
    """
    limiter = Limiter(
        app,
        key_func=get_remote_address,
        default_limits=app.config['RATELIMIT_DEFAULT'],
        storage_uri=app.config['RATELIMIT_STORAGE_URI']
    )
    # Attach limiter to app extensions for use in blueprints
    app.limiter = limiter

def configure_logging(app):
    """
    Configures logging for the Flask application.
    """
    log_level = os.getenv('LOG_LEVEL', 'INFO').upper()
    app.logger.setLevel(log_level)

    # Create a rotating file handler
    file_handler = RotatingFileHandler('app.log', maxBytes=10*1024*1024, backupCount=5)
    file_handler.setLevel(log_level)

    # Define log message format
    formatter = logging.Formatter(
        '[%(asctime)s] %(levelname)s in %(module)s: %(message)s'
    )
    file_handler.setFormatter(formatter)

    # Add the handler to the app's logger
    app.logger.addHandler(file_handler)

    # Optional: Stream logs to stdout for environments like Docker
    stream_handler = logging.StreamHandler()
    stream_handler.setLevel(log_level)
    stream_handler.setFormatter(formatter)
    app.logger.addHandler(stream_handler)

def register_blueprints(app):
    """
    Imports and registers all Blueprints with the Flask app, applying API versioning.
    """
    from app.routes import (
        users_blueprint,
        auth_blueprint,
        interests_blueprint,
        session_history_blueprint,
        personal_details_blueprint,
        account_details_blueprint,
        profile_picture_blueprint,
        notifications_blueprint,
        two_factor_bp
    )

    # Define API version prefix
    api_version = 'v1'
    api_prefix = f'/api/{api_version}'

    # Register each blueprint with its respective URL prefix
    app.register_blueprint(users_blueprint, url_prefix=f"{api_prefix}/users")
    app.register_blueprint(auth_blueprint, url_prefix=f"{api_prefix}/auth")
    app.register_blueprint(interests_blueprint, url_prefix=f"{api_prefix}/interests")
    app.register_blueprint(session_history_blueprint, url_prefix=f"{api_prefix}/session")
    app.register_blueprint(personal_details_blueprint, url_prefix=f"{api_prefix}/personal_details")
    app.register_blueprint(account_details_blueprint, url_prefix=f"{api_prefix}/account")
    app.register_blueprint(notifications_blueprint, url_prefix=f"{api_prefix}/notifications")
    app.register_blueprint(profile_picture_blueprint, url_prefix=f"{api_prefix}/profile_picture")
    app.register_blueprint(two_factor_bp, url_prefix=f"{api_prefix}/users/2fa")

def add_additional_routes(app):
    """
    Adds additional routes that are not part of any Blueprint.
    """
    @app.route('/uploads/<path:filename>')
    def uploaded_file(filename):
        """
        Serves uploaded files from the 'uploads' directory.
        """
        uploads_dir = os.path.join(app.root_path, 'uploads')
        return send_from_directory(uploads_dir, filename)

    @app.route('/api/routes', methods=['GET'])
    def list_routes():
        """
        Lists all available routes in the application (useful for debugging).
        """
        import urllib
        output = {}
        for rule in app.url_map.iter_rules():
            methods = ','.join(sorted(rule.methods))
            line = urllib.parse.unquote(f"{rule.endpoint}: {rule}")
            output[line] = methods
        return jsonify(output)

def register_error_handlers(app):
    """
    Registers global error handlers to manage exceptions gracefully.
    """
    @app.errorhandler(Exception)
    def handle_exception(e):
        """
        Global error handler that returns a JSON response with a 500 status code.
        """
        # Log the error with stack trace
        app.logger.error(f"Unhandled Exception: {e}", exc_info=True)
        
        # Return a generic error message to the client
        response = jsonify({'error': 'An internal server error occurred.'})
        response.status_code = 500
        return response

    @app.errorhandler(404)
    def not_found_error(e):
        """
        Handler for 404 Not Found errors.
        """
        return jsonify({'error': 'Resource not found.'}), 404

    @app.errorhandler(429)
    def rate_limit_error(e):
        """
        Handler for rate limit exceeded errors.
        """
        return jsonify({'error': 'Rate limit exceeded. Please try again later.'}), 429
