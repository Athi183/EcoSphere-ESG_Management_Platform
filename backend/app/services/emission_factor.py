from sqlalchemy.orm import Session
from app.models.emission_factor import EmissionFactor
from app.schemas.emission_factor import EmissionFactorCreate, EmissionFactorUpdate

def get_emission_factors(db: Session, skip: int = 0, limit: int = 100):
    total = db.query(EmissionFactor).count()
    items = db.query(EmissionFactor).offset(skip).limit(limit).all()
    return total, items

def get_emission_factor_by_id(db: Session, ef_id: int):
    return db.query(EmissionFactor).filter(EmissionFactor.id == ef_id).first()

def get_emission_factor_by_source_name(db: Session, source_name: str):
    return db.query(EmissionFactor).filter(EmissionFactor.source_name == source_name).first()

def create_emission_factor(db: Session, ef_in: EmissionFactorCreate):
    db_ef = EmissionFactor(
        source_name=ef_in.source_name,
        unit=ef_in.unit,
        emission_factor=ef_in.emission_factor,
        description=ef_in.description,
        status=ef_in.status
    )
    db.add(db_ef)
    db.commit()
    db.refresh(db_ef)
    return db_ef

def update_emission_factor(db: Session, db_ef: EmissionFactor, ef_in: EmissionFactorUpdate):
    update_data = ef_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_ef, key, value)
    db.commit()
    db.refresh(db_ef)
    return db_ef

def delete_emission_factor(db: Session, db_ef: EmissionFactor):
    if db_ef.transactions:
        return "Cannot delete this emission factor because it is referenced by existing carbon transactions."
        
    db.delete(db_ef)
    db.commit()
    return None
