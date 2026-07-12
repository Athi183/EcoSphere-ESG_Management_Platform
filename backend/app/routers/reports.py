from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.routers.auth import get_current_user
from app.schemas.report import (
    EnvironmentalReport,
    SocialReport,
    GovernanceReport,
    ESGSummaryReport
)
from app.services import report as report_service

router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
    dependencies=[Depends(get_current_user)]
)

@router.get(
    "/environmental",
    summary="Get Environmental Report",
    description="Returns the aggregated environmental report, including emission summaries, charts, and recent carbon transactions."
)
def get_environmental_report(db: Session = Depends(get_db)):
    try:
        report = report_service.get_environmental_report(db)
        return {
            "success": True,
            "message": "Environmental report retrieved successfully",
            "data": EnvironmentalReport.model_validate(report).model_dump(by_alias=True)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get(
    "/social",
    summary="Get Social Report",
    description="Returns the aggregated social report, including CSR activity statuses and recent activities."
)
def get_social_report(db: Session = Depends(get_db)):
    try:
        report = report_service.get_social_report(db)
        return {
            "success": True,
            "message": "Social report retrieved successfully",
            "data": SocialReport.model_validate(report).model_dump(by_alias=True)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get(
    "/governance",
    summary="Get Governance Report",
    description="Returns the aggregated governance report, including policy statuses and recent policies."
)
def get_governance_report(db: Session = Depends(get_db)):
    try:
        report = report_service.get_governance_report(db)
        return {
            "success": True,
            "message": "Governance report retrieved successfully",
            "data": GovernanceReport.model_validate(report).model_dump(by_alias=True)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get(
    "/esg-summary",
    summary="Get ESG Summary Report",
    description="Returns the combined environmental, social, and governance reports."
)
def get_esg_summary_report(db: Session = Depends(get_db)):
    try:
        report = report_service.get_esg_summary(db)
        return {
            "success": True,
            "message": "ESG summary report retrieved successfully",
            "data": ESGSummaryReport.model_validate(report).model_dump(by_alias=True)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
