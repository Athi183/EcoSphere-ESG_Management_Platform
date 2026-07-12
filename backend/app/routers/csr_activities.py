from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.routers.auth import get_current_user
from app.schemas.csr_activity import CSRActivityCreate, CSRActivityUpdate, CSRActivityResponse
from app.services import csr_activity as csr_service

router = APIRouter(
    prefix="/csr-activities", 
    tags=["csr_activities"], 
    dependencies=[Depends(get_current_user)]
)

@router.post("", summary="Create a CSR Activity", description="Creates a new CSR Activity. Validates that the category exists and is of type CSR_ACTIVITY.")
def create_csr_activity(activity_in: CSRActivityCreate, response: Response, db: Session = Depends(get_db)):
    activity, error = csr_service.create_csr_activity(db, activity_in)
    if error:
        response.status_code = 400
        return {"success": False, "message": error, "data": {}}
        
    return {"success": True, "message": "CSR Activity created successfully", "data": CSRActivityResponse.model_validate(activity).model_dump()}

@router.get("", summary="List all CSR Activities", description="Retrieves a paginated list of CSR Activities ordered by creation date descending.")
def read_csr_activities(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    total, items = csr_service.get_csr_activities(db, skip=skip, limit=limit)
    items_data = [CSRActivityResponse.model_validate(item).model_dump() for item in items]
    return {"success": True, "message": "CSR Activities fetched successfully", "data": {"items": items_data, "total": total}}

@router.get("/{activity_id}", summary="Get CSR Activity by ID", description="Fetches a specific CSR Activity by its ID.")
def read_csr_activity(activity_id: int, response: Response, db: Session = Depends(get_db)):
    activity = csr_service.get_csr_activity_by_id(db, activity_id)
    if not activity:
        response.status_code = 404
        return {"success": False, "message": "CSR Activity not found", "data": {}}
    return {"success": True, "message": "CSR Activity fetched successfully", "data": CSRActivityResponse.model_validate(activity).model_dump()}

@router.put("/{activity_id}", summary="Update a CSR Activity", description="Updates a CSR Activity. Validates category if changed.")
def update_csr_activity(activity_id: int, activity_in: CSRActivityUpdate, response: Response, db: Session = Depends(get_db)):
    activity = csr_service.get_csr_activity_by_id(db, activity_id)
    if not activity:
        response.status_code = 404
        return {"success": False, "message": "CSR Activity not found", "data": {}}
            
    updated_activity, error = csr_service.update_csr_activity(db, activity, activity_in)
    if error:
        response.status_code = 400
        return {"success": False, "message": error, "data": {}}
        
    return {"success": True, "message": "CSR Activity updated successfully", "data": CSRActivityResponse.model_validate(updated_activity).model_dump()}

@router.delete("/{activity_id}", summary="Delete a CSR Activity", description="Deletes a specific CSR Activity by its ID.")
def delete_csr_activity(activity_id: int, response: Response, db: Session = Depends(get_db)):
    activity = csr_service.get_csr_activity_by_id(db, activity_id)
    if not activity:
        response.status_code = 404
        return {"success": False, "message": "CSR Activity not found", "data": {}}
    
    csr_service.delete_csr_activity(db, activity)
    return {"success": True, "message": "CSR Activity deleted successfully", "data": {}}
