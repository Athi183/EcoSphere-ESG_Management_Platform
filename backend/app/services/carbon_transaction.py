from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.carbon_transaction import CarbonTransaction
from app.models.department import Department
from app.models.emission_factor import EmissionFactor
from app.schemas.carbon_transaction import CarbonTransactionCreate
import datetime

def get_transactions(db: Session, skip: int = 0, limit: int = 100):
    total = db.query(CarbonTransaction).count()
    items = db.query(CarbonTransaction).offset(skip).limit(limit).all()
    return total, items

def get_transaction_by_id(db: Session, tx_id: int):
    return db.query(CarbonTransaction).filter(CarbonTransaction.id == tx_id).first()

def create_transaction(db: Session, tx_in: CarbonTransactionCreate):
    dept = db.query(Department).filter(Department.id == tx_in.department_id).first()
    if not dept:
        return None, "Department not found"
        
    ef = db.query(EmissionFactor).filter(EmissionFactor.id == tx_in.emission_factor_id).first()
    if not ef:
        return None, "Emission Factor not found"
        
    calc_emission = tx_in.quantity * ef.emission_factor
    calc_emission = round(calc_emission, 2)
    
    txn_date = tx_in.transaction_date if tx_in.transaction_date else datetime.datetime.now(datetime.timezone.utc)
    
    db_tx = CarbonTransaction(
        department_id=tx_in.department_id,
        emission_factor_id=tx_in.emission_factor_id,
        quantity=tx_in.quantity,
        calculated_emission=calc_emission,
        transaction_date=txn_date,
        remarks=tx_in.remarks
    )
    db.add(db_tx)
    db.commit()
    db.refresh(db_tx)
    return db_tx, None

def delete_transaction(db: Session, db_tx: CarbonTransaction):
    db.delete(db_tx)
    db.commit()
