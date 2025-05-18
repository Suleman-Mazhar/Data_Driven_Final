from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
import os
from dotenv import load_dotenv

load_dotenv()

# Database configuration
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')

DATABASE_URI = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Initialize SQLAlchemy
db = SQLAlchemy()

def get_engine():
    return create_engine(DATABASE_URI)

def test_connection():
    try:
        engine = get_engine()
        connection = engine.connect()
        connection.close()
        return True
    except SQLAlchemyError as e:
        print(f"Database connection error: {e}")
        return False