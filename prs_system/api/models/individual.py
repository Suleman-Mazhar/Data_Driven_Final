from api.config.db import db
import uuid

class Individual(db.Model):
    __tablename__ = 'individual'
    
    PRS_ID = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    DOB = db.Column(db.Date, nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    enrollment_date = db.Column(db.Date, nullable=False, server_default=db.func.current_date())
    is_minor = db.Column(db.Boolean, nullable=False, default=False)
    guardian_PRS_ID = db.Column(db.String(36), db.ForeignKey('individual.PRS_ID'))
    
    # Relationships
    national_identifiers = db.relationship('NationalIdentifier', backref='individual', lazy=True, cascade="all, delete-orphan")
    user_roles = db.relationship('UserRole', backref='individual', lazy=True, cascade="all, delete-orphan")
    purchases = db.relationship('Purchase', backref='individual', lazy=True)
    vaccination_records = db.relationship('VaccinationRecord', backref='individual', lazy=True, cascade="all, delete-orphan")
    
    def to_dict(self):
        return {
            'PRS_ID': self.PRS_ID,
            'DOB': self.DOB.isoformat() if self.DOB else None,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'enrollment_date': self.enrollment_date.isoformat() if self.enrollment_date else None,
            'is_minor': self.is_minor,
            'guardian_PRS_ID': self.guardian_PRS_ID
        }