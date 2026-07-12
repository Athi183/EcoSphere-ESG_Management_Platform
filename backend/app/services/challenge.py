from sqlalchemy.orm import Session
from app.models.challenge import Challenge
from app.models.category import Category, CategoryType
from app.schemas.challenge import ChallengeCreate, ChallengeUpdate

def get_challenges(db: Session, skip: int = 0, limit: int = 100):
    total = db.query(Challenge).count()
    items = db.query(Challenge).order_by(Challenge.created_at.desc()).offset(skip).limit(limit).all()
    return total, items

def get_challenge_by_id(db: Session, challenge_id: int):
    return db.query(Challenge).filter(Challenge.id == challenge_id).first()

def create_challenge(db: Session, challenge_in: ChallengeCreate):
    category = db.query(Category).filter(Category.id == challenge_in.category_id).first()
    if not category or category.type != CategoryType.CHALLENGE:
        return None, "Selected category is not a Challenge category."
        
    db_challenge = Challenge(
        title=challenge_in.title,
        category_id=challenge_in.category_id,
        description=challenge_in.description,
        xp=challenge_in.xp,
        difficulty=challenge_in.difficulty,
        deadline=challenge_in.deadline,
        status=challenge_in.status
    )
    db.add(db_challenge)
    db.commit()
    db.refresh(db_challenge)
    return db_challenge, None

def update_challenge(db: Session, db_challenge: Challenge, challenge_in: ChallengeUpdate):
    if challenge_in.category_id is not None:
        category = db.query(Category).filter(Category.id == challenge_in.category_id).first()
        if not category or category.type != CategoryType.CHALLENGE:
            return None, "Selected category is not a Challenge category."

    update_data = challenge_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_challenge, key, value)
    db.commit()
    db.refresh(db_challenge)
    return db_challenge, None

def delete_challenge(db: Session, db_challenge: Challenge):
    db.delete(db_challenge)
    db.commit()
