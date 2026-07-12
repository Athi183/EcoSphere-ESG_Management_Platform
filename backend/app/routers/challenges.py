from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.routers.auth import get_current_user
from app.schemas.challenge import ChallengeCreate, ChallengeUpdate, ChallengeResponse
from app.services import challenge as challenge_service

router = APIRouter(
    prefix="/challenges", 
    tags=["challenges"], 
    dependencies=[Depends(get_current_user)]
)

@router.post("", summary="Create a Challenge", description="Creates a new Challenge. Validates that the category exists and is of type CHALLENGE.")
def create_challenge(challenge_in: ChallengeCreate, response: Response, db: Session = Depends(get_db)):
    challenge, error = challenge_service.create_challenge(db, challenge_in)
    if error:
        response.status_code = 400
        return {"success": False, "message": error, "data": {}}
        
    return {"success": True, "message": "Challenge created successfully", "data": ChallengeResponse.model_validate(challenge).model_dump()}

@router.get("", summary="List all Challenges", description="Retrieves a paginated list of Challenges ordered by creation date descending.")
def read_challenges(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    total, items = challenge_service.get_challenges(db, skip=skip, limit=limit)
    items_data = [ChallengeResponse.model_validate(item).model_dump() for item in items]
    return {"success": True, "message": "Challenges fetched successfully", "data": {"items": items_data, "total": total}}

@router.get("/{challenge_id}", summary="Get Challenge by ID", description="Fetches a specific Challenge by its ID.")
def read_challenge(challenge_id: int, response: Response, db: Session = Depends(get_db)):
    challenge = challenge_service.get_challenge_by_id(db, challenge_id)
    if not challenge:
        response.status_code = 404
        return {"success": False, "message": "Challenge not found", "data": {}}
    return {"success": True, "message": "Challenge fetched successfully", "data": ChallengeResponse.model_validate(challenge).model_dump()}

@router.put("/{challenge_id}", summary="Update a Challenge", description="Updates a Challenge. Validates category if changed.")
def update_challenge(challenge_id: int, challenge_in: ChallengeUpdate, response: Response, db: Session = Depends(get_db)):
    challenge = challenge_service.get_challenge_by_id(db, challenge_id)
    if not challenge:
        response.status_code = 404
        return {"success": False, "message": "Challenge not found", "data": {}}
            
    updated_challenge, error = challenge_service.update_challenge(db, challenge, challenge_in)
    if error:
        response.status_code = 400
        return {"success": False, "message": error, "data": {}}
        
    return {"success": True, "message": "Challenge updated successfully", "data": ChallengeResponse.model_validate(updated_challenge).model_dump()}

@router.delete("/{challenge_id}", summary="Delete a Challenge", description="Deletes a specific Challenge by its ID.")
def delete_challenge(challenge_id: int, response: Response, db: Session = Depends(get_db)):
    challenge = challenge_service.get_challenge_by_id(db, challenge_id)
    if not challenge:
        response.status_code = 404
        return {"success": False, "message": "Challenge not found", "data": {}}
    
    challenge_service.delete_challenge(db, challenge)
    return {"success": True, "message": "Challenge deleted successfully", "data": {}}
