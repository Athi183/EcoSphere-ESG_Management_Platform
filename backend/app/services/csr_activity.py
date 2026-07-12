from sqlalchemy.orm import Session
from app.models.csr_activity import CSRActivity
from app.models.category import Category, CategoryType
from app.schemas.csr_activity import CSRActivityCreate, CSRActivityUpdate

def get_csr_activities(db: Session, skip: int = 0, limit: int = 100):
    total = db.query(CSRActivity).count()
    items = db.query(CSRActivity).order_by(CSRActivity.created_at.desc()).offset(skip).limit(limit).all()
    return total, items

def get_csr_activity_by_id(db: Session, activity_id: int):
    return db.query(CSRActivity).filter(CSRActivity.id == activity_id).first()

def create_csr_activity(db: Session, activity_in: CSRActivityCreate):
    category = db.query(Category).filter(Category.id == activity_in.category_id).first()
    if not category or category.type != CategoryType.CSR_ACTIVITY:
        return None, "Selected category is not a CSR Activity category."
        
    db_activity = CSRActivity(
        title=activity_in.title,
        category_id=activity_in.category_id,
        description=activity_in.description,
        location=activity_in.location,
        activity_date=activity_in.activity_date,
        status=activity_in.status
    )
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity, None

def update_csr_activity(db: Session, db_activity: CSRActivity, activity_in: CSRActivityUpdate):
    if activity_in.category_id is not None:
        category = db.query(Category).filter(Category.id == activity_in.category_id).first()
        if not category or category.type != CategoryType.CSR_ACTIVITY:
            return None, "Selected category is not a CSR Activity category."

    update_data = activity_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_activity, key, value)
    db.commit()
    db.refresh(db_activity)
    return db_activity, None

def delete_csr_activity(db: Session, db_activity: CSRActivity):
    db.delete(db_activity)
    db.commit()
