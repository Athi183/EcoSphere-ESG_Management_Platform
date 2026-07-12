from app.database.database import SessionLocal
from app.models.user import User, UserRole
from app.core.security import get_password_hash

db = SessionLocal()
try:
    admin = db.query(User).filter(User.email == "admin@ecosphere.com").first()
    if not admin:
        admin = User(
            email="admin@ecosphere.com",
            full_name="Admin User",
            password_hash=get_password_hash("admin123"),
            role=UserRole.admin
        )
        db.add(admin)
        db.commit()
        print("Admin user created successfully!")
    else:
        # Reset password/role just in case
        admin.role = UserRole.admin
        admin.password_hash = get_password_hash("admin123")
        db.commit()
        print("Admin user updated successfully!")
finally:
    db.close()
