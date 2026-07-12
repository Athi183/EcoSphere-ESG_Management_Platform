from sqlalchemy.orm import Session
from app.models.category import Category, CategoryType
from app.schemas.category import CategoryCreate, CategoryUpdate

def get_categories(db: Session, skip: int = 0, limit: int = 100):
    total = db.query(Category).count()
    items = db.query(Category).offset(skip).limit(limit).all()
    return total, items

def get_category_by_id(db: Session, category_id: int):
    return db.query(Category).filter(Category.id == category_id).first()

def get_category_by_name_and_type(db: Session, name: str, cat_type: CategoryType):
    return db.query(Category).filter(
        Category.name == name,
        Category.type == cat_type
    ).first()

def create_category(db: Session, cat_in: CategoryCreate):
    db_cat = Category(
        name=cat_in.name,
        type=cat_in.type,
        status=cat_in.status
    )
    db.add(db_cat)
    db.commit()
    db.refresh(db_cat)
    return db_cat

def update_category(db: Session, db_cat: Category, cat_in: CategoryUpdate):
    update_data = cat_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_cat, key, value)
    db.commit()
    db.refresh(db_cat)
    return db_cat

def delete_category(db: Session, db_cat: Category):
    if db_cat.csr_activities:
        return "Cannot delete this category because it is referenced by existing CSR activities."
        
    if db_cat.challenges:
        return "Cannot delete this category because it is referenced by existing Challenges."
        
    db.delete(db_cat)
    db.commit()
    return None
