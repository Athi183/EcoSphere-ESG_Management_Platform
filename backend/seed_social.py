import os
import sys

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.database import SessionLocal
from app.models.csr_activity import CSRActivity
from app.models.gamification import CSRParticipation
from app.models.user import User

def seed_social():
    db = SessionLocal()
    
    print("Seeding CSR Activities...")
    # Fetch random users
    users = db.query(User).limit(5).all()
    if not users:
        print("No users found. Please create users first.")
        return
        
    activities = db.query(CSRActivity).all()
    
    if len(activities) < 2:
        print("Not enough activities, please create them via the UI.")
    else:
        # Let's add some participations to the approval queue for these activities
        print("Seeding Approval Queue (Participations)...")
        import random
        
        for activity in activities:
            for user in users:
                # 50% chance they joined
                if random.random() > 0.5:
                    existing = db.query(CSRParticipation).filter(
                        CSRParticipation.user_id == user.id,
                        CSRParticipation.activity_id == activity.id
                    ).first()
                    
                    if not existing:
                        part = CSRParticipation(
                            user_id=user.id,
                            activity_id=activity.id,
                            status=random.choice(["PENDING", "APPROVED"]),
                            proof_url="https://example.com/proof.jpg" if random.random() > 0.3 else None,
                            points_awarded=random.choice([50, 100, 150, 200]) if random.random() > 0.5 else 0
                        )
                        db.add(part)
        
        db.commit()
        print("Approval Queue Seeded!")
        
    db.close()

if __name__ == "__main__":
    seed_social()
