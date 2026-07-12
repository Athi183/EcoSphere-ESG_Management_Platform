from sqlalchemy.orm import Session
from app.models.policy import ESGPolicy
from app.schemas.policy import ESGPolicyCreate, ESGPolicyUpdate

def get_policies(db: Session, skip: int = 0, limit: int = 100):
    total = db.query(ESGPolicy).count()
    items = db.query(ESGPolicy).order_by(ESGPolicy.created_at.desc()).offset(skip).limit(limit).all()
    return total, items

def get_policy_by_id(db: Session, policy_id: int):
    return db.query(ESGPolicy).filter(ESGPolicy.id == policy_id).first()

def get_policy_by_title_and_version(db: Session, title: str, version: str):
    return db.query(ESGPolicy).filter(ESGPolicy.title == title, ESGPolicy.version == version).first()

def create_policy(db: Session, policy_in: ESGPolicyCreate):
    db_policy = ESGPolicy(
        title=policy_in.title,
        description=policy_in.description,
        version=policy_in.version,
        effective_date=policy_in.effective_date,
        status=policy_in.status
    )
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy

def update_policy(db: Session, db_policy: ESGPolicy, policy_in: ESGPolicyUpdate):
    update_data = policy_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_policy, key, value)
    db.commit()
    db.refresh(db_policy)
    return db_policy

def delete_policy(db: Session, db_policy: ESGPolicy):
    db.delete(db_policy)
    db.commit()
