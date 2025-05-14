
import uuid
from datetime import datetime, timedelta, date
from api.models import (
    Individual, Role, UserRole, CriticalItem, PurchaseLimit, PurchaseSchedule,
    Merchant, StoreLocation, StockLevel, VaccinationRecord
)
from api.utils.encryption import hash_password

def seed_data(db):
    """
    Seed the database with initial test data
    """
    print("Seeding database with test data...")
    
    # Check if data already exists
    if Individual.query.count() > 0:
        print("Database already contains data. Skipping seeding.")
        return
    
    # Create roles
    roles = {
        'public': Role(
            role_id=str(uuid.uuid4()),
            role_name='public',
            description='Regular public user',
            permissions={
                'view_critical_items': True,
                'update_profile': True,
                'upload_vaccination': True
            }
        ),
        'merchant': Role(
            role_id=str(uuid.uuid4()),
            role_name='merchant',
            description='Store/pharmacy owner',
            permissions={
                'view_critical_items': True,
                'update_stock': True,
                'process_purchase': True
            }
        ),
        'government_official': Role(
            role_id=str(uuid.uuid4()),
            role_name='government_official',
            description='Government staff',
            permissions={
                'view_all_data': True,
                'verify_vaccination': True,
                'manage_restrictions': True
            }
        )
    }
    
    for role in roles.values():
        db.session.add(role)
    
    # Create individuals
    individuals = {
        'public': Individual(
            PRS_ID='PRS123456',
            first_name='John',
            last_name='Doe',
            DOB=date(1985, 5, 15),
            is_minor=False
        ),
        'merchant': Individual(
            PRS_ID='PRS234567',
            first_name='Jane',
            last_name='Smith',
            DOB=date(1978, 8, 22),
            is_minor=False
        ),
        'government': Individual(
            PRS_ID='GOVPRS789',
            first_name='Michael',
            last_name='Johnson',
            DOB=date(1972, 3, 10),
            is_minor=False
        )
    }
    
    for individual in individuals.values():
        db.session.add(individual)
    
    # Flush to get IDs
    db.session.flush()
    
    # Assign roles
    user_roles = [
        UserRole(
            user_role_id=str(uuid.uuid4()),
            individual_PRS_ID=individuals['public'].PRS_ID,
            role_id=roles['public'].role_id,
            is_active=True
        ),
        UserRole(
            user_role_id=str(uuid.uuid4()),
            individual_PRS_ID=individuals['merchant'].PRS_ID,
            role_id=roles['merchant'].role_id,
            is_active=True
        ),
        UserRole(
            user_role_id=str(uuid.uuid4()),
            individual_PRS_ID=individuals['government'].PRS_ID,
            role_id=roles['government_official'].role_id,
            is_active=True
        )
    ]
    
    for user_role in user_roles:
        db.session.add(user_role)
    
    # Commit all changes
    db.session.commit()
    
    print("Database seeding completed successfully!")
