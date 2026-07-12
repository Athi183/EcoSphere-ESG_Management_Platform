from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.routers.auth import get_current_user
from app.schemas.ai import AIChatRequest
from app.services.ai_service import generate_ai_response

router = APIRouter(
    prefix="/ai", 
    tags=["ai"], 
    dependencies=[Depends(get_current_user)]
)

@router.post(
    "/chat", 
    summary="Chat with EcoSphere AI", 
    description="Send a message to the AI. The AI automatically receives live dashboard context and answers accordingly."
)
def ai_chat(request: AIChatRequest, response: Response, db: Session = Depends(get_db)):
    ai_resp, prompt_used, error = generate_ai_response(db, request.message, request.history, request.report_context)
    if error:
        response.status_code = 503
        return {"success": False, "message": error}
        
    return {
        "success": True,
        "message": "AI response generated successfully",
        "data": {
            "response": ai_resp,
            "prompt_used": prompt_used
        }
    }
