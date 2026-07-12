from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.routers.auth import get_current_user
from app.schemas.dashboard import DashboardData
from app.services.dashboard import get_dashboard_data

router = APIRouter(
    prefix="/dashboard", 
    tags=["dashboard"], 
    dependencies=[Depends(get_current_user)]
)

@router.get("/summary", summary="Get Dashboard Summary", description="Retrieves aggregated dashboard data including summary metrics, charts data, and the 5 most recent carbon transactions. All calculations are derived dynamically from the database. Returns zeros and empty arrays if the database is empty.")
def read_dashboard_summary(db: Session = Depends(get_db)):
    data = get_dashboard_data(db)
    # By using by_alias=True, we ensure the 'emission_source' alias on the recent transactions is output correctly.
    return {
        "success": True,
        "message": "Dashboard data fetched successfully",
        "data": data.model_dump(by_alias=True)
    }
