from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.routers.auth import get_current_user
from app.schemas.policy import ESGPolicyCreate, ESGPolicyUpdate, ESGPolicyResponse
from app.services import policy as policy_service

router = APIRouter(
    prefix="/policies", 
    tags=["policies"], 
    dependencies=[Depends(get_current_user)]
)

@router.post("", summary="Create an ESG Policy", description="Creates a new ESG Policy. Fails if a policy with the same title and version already exists.")
def create_policy(policy_in: ESGPolicyCreate, response: Response, db: Session = Depends(get_db)):
    if policy_service.get_policy_by_title_and_version(db, policy_in.title, policy_in.version):
        response.status_code = 400
        return {"success": False, "message": "Policy with this title and version already exists", "data": {}}
        
    policy = policy_service.create_policy(db, policy_in)
    return {"success": True, "message": "Policy created successfully", "data": ESGPolicyResponse.model_validate(policy).model_dump()}

@router.get("", summary="List all ESG Policies", description="Retrieves a paginated list of ESG Policies ordered by creation date descending.")
def read_policies(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    total, items = policy_service.get_policies(db, skip=skip, limit=limit)
    items_data = [ESGPolicyResponse.model_validate(item).model_dump() for item in items]
    return {"success": True, "message": "Policies fetched successfully", "data": {"items": items_data, "total": total}}

@router.get("/{policy_id}", summary="Get Policy by ID", description="Fetches a specific ESG Policy by its ID.")
def read_policy(policy_id: int, response: Response, db: Session = Depends(get_db)):
    policy = policy_service.get_policy_by_id(db, policy_id)
    if not policy:
        response.status_code = 404
        return {"success": False, "message": "Policy not found", "data": {}}
    return {"success": True, "message": "Policy fetched successfully", "data": ESGPolicyResponse.model_validate(policy).model_dump()}

@router.put("/{policy_id}", summary="Update a Policy", description="Updates an ESG Policy.")
def update_policy(policy_id: int, policy_in: ESGPolicyUpdate, response: Response, db: Session = Depends(get_db)):
    policy = policy_service.get_policy_by_id(db, policy_id)
    if not policy:
        response.status_code = 404
        return {"success": False, "message": "Policy not found", "data": {}}
            
    new_title = policy_in.title if policy_in.title is not None else policy.title
    new_version = policy_in.version if policy_in.version is not None else policy.version
    
    if (new_title != policy.title) or (new_version != policy.version):
        if policy_service.get_policy_by_title_and_version(db, new_title, new_version):
            response.status_code = 400
            return {"success": False, "message": "Policy with this title and version already exists", "data": {}}
            
    updated_policy = policy_service.update_policy(db, policy, policy_in)
    return {"success": True, "message": "Policy updated successfully", "data": ESGPolicyResponse.model_validate(updated_policy).model_dump()}

@router.delete("/{policy_id}", summary="Delete a Policy", description="Deletes a specific ESG Policy by its ID.")
def delete_policy(policy_id: int, response: Response, db: Session = Depends(get_db)):
    policy = policy_service.get_policy_by_id(db, policy_id)
    if not policy:
        response.status_code = 404
        return {"success": False, "message": "Policy not found", "data": {}}
    
    policy_service.delete_policy(db, policy)
    return {"success": True, "message": "Policy deleted successfully", "data": {}}
