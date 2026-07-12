from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.carbon_transaction import CarbonTransaction
from app.models.csr_activity import CSRActivity, CSRActivityStatus
from app.models.policy import ESGPolicy, PolicyStatus

from app.services.dashboard import get_dashboard_data
from app.schemas.report import (
    EnvironmentalReport, EnvironmentalSummary,
    SocialReport, SocialSummary,
    GovernanceReport, GovernanceSummary,
    ESGSummaryReport
)

def get_environmental_report(db: Session) -> EnvironmentalReport:
    dashboard_data = get_dashboard_data(db)
    
    # 10 recent transactions
    recent_txs = db.query(CarbonTransaction).order_by(CarbonTransaction.transaction_date.desc()).limit(10).all()
    
    summary = EnvironmentalSummary(
        total_emissions=dashboard_data.summary.total_emissions,
        total_transactions=dashboard_data.summary.total_transactions,
        average_emission=dashboard_data.summary.average_emission_per_transaction,
        top_department=dashboard_data.summary.top_department,
        top_emission_source=dashboard_data.summary.top_emission_source
    )
    
    return EnvironmentalReport(
        summary=summary,
        charts=dashboard_data.charts,
        recent_transactions=recent_txs
    )

def get_social_report(db: Session) -> SocialReport:
    total_activities = db.query(CSRActivity).count()
    
    planned = db.query(CSRActivity).filter(CSRActivity.status == CSRActivityStatus.PLANNED).count()
    ongoing = db.query(CSRActivity).filter(CSRActivity.status == CSRActivityStatus.ONGOING).count()
    completed = db.query(CSRActivity).filter(CSRActivity.status == CSRActivityStatus.COMPLETED).count()
    cancelled = db.query(CSRActivity).filter(CSRActivity.status == CSRActivityStatus.CANCELLED).count()
    
    summary = SocialSummary(
        total_activities=total_activities,
        planned=planned,
        ongoing=ongoing,
        completed=completed,
        cancelled=cancelled
    )
    
    recent_activities = db.query(CSRActivity).order_by(CSRActivity.created_at.desc()).limit(10).all()
    
    return SocialReport(
        summary=summary,
        recent_activities=recent_activities
    )

def get_governance_report(db: Session) -> GovernanceReport:
    total_policies = db.query(ESGPolicy).count()
    
    draft = db.query(ESGPolicy).filter(ESGPolicy.status == PolicyStatus.DRAFT).count()
    active = db.query(ESGPolicy).filter(ESGPolicy.status == PolicyStatus.ACTIVE).count()
    archived = db.query(ESGPolicy).filter(ESGPolicy.status == PolicyStatus.ARCHIVED).count()
    
    summary = GovernanceSummary(
        total_policies=total_policies,
        draft=draft,
        active=active,
        archived=archived
    )
    
    recent_policies = db.query(ESGPolicy).order_by(ESGPolicy.created_at.desc()).limit(10).all()
    
    return GovernanceReport(
        summary=summary,
        recent_policies=recent_policies
    )

def get_esg_summary(db: Session) -> ESGSummaryReport:
    env_report = get_environmental_report(db)
    soc_report = get_social_report(db)
    gov_report = get_governance_report(db)
    
    return ESGSummaryReport(
        environmental=env_report,
        social=soc_report,
        governance=gov_report
    )
