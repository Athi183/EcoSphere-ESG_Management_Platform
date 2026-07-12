from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.routers.auth import get_current_user
from app.schemas.carbon_transaction import CarbonTransactionCreate, CarbonTransactionResponse
from app.services import carbon_transaction as tx_service

router = APIRouter(
    prefix="/carbon-transactions", 
    tags=["carbon transactions"], 
    dependencies=[Depends(get_current_user)]
)

@router.post("", summary="Create Carbon Transaction", description="Records an emission activity. The backend automatically calculates the carbon emission based on the referenced emission factor. Fails with 404 if the department or emission factor does not exist.")
def create_carbon_transaction(tx_in: CarbonTransactionCreate, response: Response, db: Session = Depends(get_db)):
    tx, error = tx_service.create_transaction(db, tx_in)
    if error:
        response.status_code = 404
        return {"success": False, "message": error, "data": {}}
    
    return {"success": True, "message": "Carbon transaction created successfully", "data": CarbonTransactionResponse.model_validate(tx).model_dump()}

@router.get("", summary="List Carbon Transactions", description="Retrieves a paginated list of carbon transactions including nested department and emission source details.")
def read_carbon_transactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    total, items = tx_service.get_transactions(db, skip=skip, limit=limit)
    items_data = [CarbonTransactionResponse.model_validate(item).model_dump() for item in items]
    return {"success": True, "message": "Carbon transactions fetched successfully", "data": {"items": items_data, "total": total}}

@router.get("/{tx_id}", summary="Get Carbon Transaction by ID", description="Fetches a specific carbon transaction by its ID.")
def read_carbon_transaction(tx_id: int, response: Response, db: Session = Depends(get_db)):
    tx = tx_service.get_transaction_by_id(db, tx_id)
    if not tx:
        response.status_code = 404
        return {"success": False, "message": "Carbon transaction not found", "data": {}}
    return {"success": True, "message": "Carbon transaction fetched successfully", "data": CarbonTransactionResponse.model_validate(tx).model_dump()}

@router.delete("/{tx_id}", summary="Delete Carbon Transaction", description="Deletes a specific carbon transaction by its ID.")
def delete_carbon_transaction(tx_id: int, response: Response, db: Session = Depends(get_db)):
    tx = tx_service.get_transaction_by_id(db, tx_id)
    if not tx:
        response.status_code = 404
        return {"success": False, "message": "Carbon transaction not found", "data": {}}
    
    tx_service.delete_transaction(db, tx)
    return {"success": True, "message": "Carbon transaction deleted successfully", "data": {}}
