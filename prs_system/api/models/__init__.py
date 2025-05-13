# api/models/__init__.py

# Import only basic models for now
from api.config.db import db

# Create Individual model directly in __init__.py for initial testing
class Individual(db.Model):
    __tablename__ = 'individual'
    
    PRS_ID = db.Column(db.String(36), primary_key=True)
    DOB = db.Column(db.Date, nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    enrollment_date = db.Column(db.Date, nullable=False, server_default=db.func.current_date())
    is_minor = db.Column(db.Boolean, nullable=False, default=False)
    guardian_PRS_ID = db.Column(db.String(36), db.ForeignKey('individual.PRS_ID'))

# Create Role model directly in __init__.py for initial testing
class Role(db.Model):
    __tablename__ = 'role'
    
    role_id = db.Column(db.String(36), primary_key=True)
    role_name = db.Column(db.String(50), nullable=False, unique=True)
    description = db.Column(db.Text)
    permissions = db.Column(db.JSON)

# Create UserRole model directly in __init__.py for initial testing
class UserRole(db.Model):
    __tablename__ = 'user_role'
    
    user_role_id = db.Column(db.String(36), primary_key=True)
    individual_PRS_ID = db.Column(db.String(36), db.ForeignKey('individual.PRS_ID'), nullable=False)
    role_id = db.Column(db.String(36), db.ForeignKey('role.role_id'), nullable=False)
    assigned_date = db.Column(db.Date, nullable=False, server_default=db.func.current_date())
    expiry_date = db.Column(db.Date)
    is_active = db.Column(db.Boolean, nullable=False, default=True)