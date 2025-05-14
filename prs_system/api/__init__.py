from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from api.config.db import db
import os

def create_app():
    # Load environment variables
    load_dotenv()
    
    # Initialize Flask app
    app = Flask(__name__)
    
    # Enable CORS
    CORS(app)
    
    # Database configuration
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_PORT = os.getenv('DB_PORT', '5432')
    DB_NAME = os.getenv('DB_NAME', 'prs_db')
    DB_USER = os.getenv('DB_USER', 'prs_app_user')
    DB_PASSWORD = os.getenv('DB_PASSWORD', 'de238ge')
    
    DATABASE_URI = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    
    # Configure database
    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Configure JWT
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'default-secret-key')
    jwt = JWTManager(app)
    
    # Initialize database
    db.init_app(app)
    
    # Register blueprints (API routes)
    # Note: You'll need to create these blueprint files
    from api.routes.auth import auth_bp
    from api.routes.individuals import individuals_bp
    from api.routes.critical_items import critical_items_bp
    from api.routes.vaccinations import vaccinations_bp
    from api.routes.purchases import purchases_bp
    from api.routes.merchants import merchants_bp
    from api.routes.dashboard import dashboard_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(individuals_bp, url_prefix='/api/individuals')
    app.register_blueprint(critical_items_bp, url_prefix='/api/critical-items')
    app.register_blueprint(vaccinations_bp, url_prefix='/api/vaccinations')
    app.register_blueprint(purchases_bp, url_prefix='/api/purchases')
    app.register_blueprint(merchants_bp, url_prefix='/api/merchants')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    
    return app