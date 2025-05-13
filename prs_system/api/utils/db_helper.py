from api.config.db import db
from sqlalchemy.exc import SQLAlchemyError
import uuid

def commit_changes():
    try:
        db.session.commit()
        return True
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Database error: {e}")
        return False

def generate_uuid():
    return str(uuid.uuid4())