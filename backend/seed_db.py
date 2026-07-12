import datetime
from sqlalchemy.orm import Session
from app.database.database import SessionLocal
from app.models.category import Category, CategoryType, CategoryStatus
from app.models.challenge import Challenge, ChallengeDifficulty, ChallengeStatus
from app.models.csr_activity import CSRActivity, CSRActivityStatus

def seed_database():
    db: Session = SessionLocal()
    
    # 1. Seed Categories
    print("Seeding Categories...")
    csr_cat = db.query(Category).filter_by(name="Community Outreach", type=CategoryType.CSR_ACTIVITY).first()
    if not csr_cat:
        csr_cat = Category(name="Community Outreach", type=CategoryType.CSR_ACTIVITY, status=CategoryStatus.ACTIVE)
        db.add(csr_cat)
        
    env_cat = db.query(Category).filter_by(name="Environmental Impact", type=CategoryType.CSR_ACTIVITY).first()
    if not env_cat:
        env_cat = Category(name="Environmental Impact", type=CategoryType.CSR_ACTIVITY, status=CategoryStatus.ACTIVE)
        db.add(env_cat)

    chal_cat = db.query(Category).filter_by(name="Energy Savings", type=CategoryType.CHALLENGE).first()
    if not chal_cat:
        chal_cat = Category(name="Energy Savings", type=CategoryType.CHALLENGE, status=CategoryStatus.ACTIVE)
        db.add(chal_cat)
        
    waste_cat = db.query(Category).filter_by(name="Waste Reduction", type=CategoryType.CHALLENGE).first()
    if not waste_cat:
        waste_cat = Category(name="Waste Reduction", type=CategoryType.CHALLENGE, status=CategoryStatus.ACTIVE)
        db.add(waste_cat)

    db.commit()
    
    # Refresh to get IDs
    db.refresh(csr_cat)
    db.refresh(env_cat)
    db.refresh(chal_cat)
    db.refresh(waste_cat)
    
    # 2. Seed Challenges
    print("Seeding Challenges...")
    if db.query(Challenge).count() == 0:
        c1 = Challenge(
            title="Zero-Waste Week",
            description="Go an entire week without generating non-recyclable waste at the office.",
            category_id=waste_cat.id,
            xp=500,
            difficulty=ChallengeDifficulty.HARD,
            deadline=datetime.date.today() + datetime.timedelta(days=7),
            status=ChallengeStatus.ACTIVE
        )
        c2 = Challenge(
            title="Turn Off the Lights",
            description="Ensure all lights in your department are turned off at the end of the day.",
            category_id=chal_cat.id,
            xp=150,
            difficulty=ChallengeDifficulty.EASY,
            deadline=datetime.date.today() + datetime.timedelta(days=3),
            status=ChallengeStatus.ACTIVE
        )
        db.add_all([c1, c2])
        db.commit()
        
    # 3. Seed CSR Activities
    print("Seeding CSR Activities...")
    if db.query(CSRActivity).count() == 0:
        csr1 = CSRActivity(
            title="Local Beach Cleanup",
            category_id=env_cat.id,
            description="Join us this weekend to clean up the local beach and protect marine life.",
            location="Sunny Beach",
            activity_date=datetime.date.today() + datetime.timedelta(days=2),
            status=CSRActivityStatus.PLANNED
        )
        csr2 = CSRActivity(
            title="Food Drive for Shelter",
            category_id=csr_cat.id,
            description="Collecting non-perishable food items for the downtown community shelter.",
            location="Main Office Lobby",
            activity_date=datetime.date.today() - datetime.timedelta(days=5),
            status=CSRActivityStatus.COMPLETED
        )
        db.add_all([csr1, csr2])
        db.commit()
        
    print("Database seeding completed successfully!")
    db.close()

if __name__ == "__main__":
    seed_database()
