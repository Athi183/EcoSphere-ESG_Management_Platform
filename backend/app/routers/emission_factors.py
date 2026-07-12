from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.routers.auth import get_current_user
from app.schemas.emission_factor import EmissionFactorCreate, EmissionFactorUpdate, EmissionFactorResponse
from app.services import emission_factor as ef_service

router = APIRouter(
    prefix="/emission-factors", 
    tags=["emission factors"], 
    dependencies=[Depends(get_current_user)]
)

@router.post("", summary="Create an Emission Factor", description="Creates a new emission factor. Fails if the source_name already exists or if emission_factor is not strictly positive.")
def create_emission_factor(ef_in: EmissionFactorCreate, db: Session = Depends(get_db)):
    if ef_service.get_emission_factor_by_source_name(db, ef_in.source_name):
        return {"success": False, "message": "Emission factor with this source name already exists", "data": {}}
    
    ef = ef_service.create_emission_factor(db, ef_in)
    return {"success": True, "message": "Emission factor created successfully", "data": EmissionFactorResponse.model_validate(ef).model_dump()}

@router.get("", summary="List all Emission Factors", description="Retrieves a paginated list of emission factors.")
def read_emission_factors(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    total, items = ef_service.get_emission_factors(db, skip=skip, limit=limit)
    items_data = [EmissionFactorResponse.model_validate(item).model_dump() for item in items]
    return {"success": True, "message": "Emission factors fetched successfully", "data": {"items": items_data, "total": total}}

@router.get("/{ef_id}", summary="Get Emission Factor by ID", description="Fetches a specific emission factor by its ID.")
def read_emission_factor(ef_id: int, db: Session = Depends(get_db)):
    ef = ef_service.get_emission_factor_by_id(db, ef_id)
    if not ef:
        return {"success": False, "message": "Emission factor not found", "data": {}}
    return {"success": True, "message": "Emission factor fetched successfully", "data": EmissionFactorResponse.model_validate(ef).model_dump()}

@router.put("/{ef_id}", summary="Update an Emission Factor", description="Updates an emission factor. Verifies that a new source_name does not conflict with an existing one.")
def update_emission_factor(ef_id: int, ef_in: EmissionFactorUpdate, db: Session = Depends(get_db)):
    ef = ef_service.get_emission_factor_by_id(db, ef_id)
    if not ef:
        return {"success": False, "message": "Emission factor not found", "data": {}}
    
    if ef_in.source_name is not None and ef_in.source_name != ef.source_name:
        if ef_service.get_emission_factor_by_source_name(db, ef_in.source_name):
            return {"success": False, "message": "Emission factor with this source name already exists", "data": {}}
            
    updated_ef = ef_service.update_emission_factor(db, ef, ef_in)
    return {"success": True, "message": "Emission factor updated successfully", "data": EmissionFactorResponse.model_validate(updated_ef).model_dump()}

@router.delete("/{ef_id}")
def delete_emission_factor(ef_id: int, response: Response, db: Session = Depends(get_db)):
    ef = ef_service.get_emission_factor_by_id(db, ef_id)
    if not ef:
        response.status_code = 404
        return {"success": False, "message": "Emission factor not found", "data": {}}
    
    err = ef_service.delete_emission_factor(db, ef)
    if err:
        response.status_code = 400
        return {"success": False, "message": err, "data": {}}
        
    return {"success": True, "message": "Emission factor deleted successfully", "data": {}}
