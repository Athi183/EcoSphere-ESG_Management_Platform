import os
import sys

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.database import SessionLocal
from app.models.gamification import Badge, UserStat
from app.models.user import User

def seed_gamification():
    db = SessionLocal()
    
    print("Seeding Badges...")
    badges = [
        Badge(name="Green Beginner", icon="🌱"),
        Badge(name="Carbon Saver", icon="☁️"),
        Badge(name="Sustainability Champion", icon="🌍"),
        Badge(name="Team Player", icon="⭐"),
    ]
    
    # Check if badges already exist
    existing = db.query(Badge).count()
    if existing == 0:
        db.add_all(badges)
        db.commit()
        print("Badges seeded!")
    else:
        print("Badges already exist.")
        
    print("Seeding Leaderboard...")
    # Give some random XP to existing users
    users = db.query(User).all()
    if not users:
        print("No users found to seed leaderboard. Please ensure you have users in the DB.")
    else:
        import random
        for user in users:
            stat = db.query(UserStat).filter(UserStat.user_id == user.id).first()
            if not stat:
                stat = UserStat(
                    user_id=user.id,
                    department=random.choice(["Manufacturing", "Corporate", "Logistics", "IT"]),
                    total_xp=random.randint(500, 5000)
                )
                db.add(stat)
            else:
                stat.total_xp += random.randint(100, 1000)
        db.commit()
        print("Leaderboard seeded!")
        
    db.close()

if __name__ == "__main__":
    seed_gamification()
