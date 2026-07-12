from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.carbon_transaction import CarbonTransaction
from app.models.department import Department, DepartmentStatus
from app.models.emission_factor import EmissionFactor
from app.schemas.dashboard import DashboardData, SummaryData, ChartsData, EmissionByDepartment, EmissionBySource

def get_dashboard_data(db: Session) -> DashboardData:
    # Basic totals
    total_emissions = db.query(func.sum(CarbonTransaction.calculated_emission)).scalar() or 0.0
    total_emissions = round(total_emissions, 2)
    
    total_transactions = db.query(CarbonTransaction).count()
    active_departments = db.query(Department).filter(Department.status == DepartmentStatus.ACTIVE).count()
    
    # Average
    average_emission = round(total_emissions / total_transactions, 2) if total_transactions > 0 else 0.0
    
    # Top Department
    top_dept_query = db.query(
        Department.name, 
        func.sum(CarbonTransaction.calculated_emission).label("total")
    ).join(CarbonTransaction).group_by(Department.id).order_by(func.sum(CarbonTransaction.calculated_emission).desc()).first()
    
    top_department = top_dept_query.name if top_dept_query else ""
    
    # Top Emission Source
    top_source_query = db.query(
        EmissionFactor.source_name,
        func.sum(CarbonTransaction.calculated_emission).label("total")
    ).join(CarbonTransaction).group_by(EmissionFactor.id).order_by(func.sum(CarbonTransaction.calculated_emission).desc()).first()
    
    top_emission_source = top_source_query.source_name if top_source_query else ""
    
    summary = SummaryData(
        total_emissions=total_emissions,
        total_transactions=total_transactions,
        active_departments=active_departments,
        top_department=top_department,
        top_emission_source=top_emission_source,
        average_emission_per_transaction=average_emission
    )
    
    # Charts: By Department
    dept_emissions_raw = db.query(
        Department.name,
        func.sum(CarbonTransaction.calculated_emission).label("total")
    ).join(CarbonTransaction).group_by(Department.id).all()
    
    dept_emissions = [EmissionByDepartment(department=row.name, emissions=round(row.total or 0, 2)) for row in dept_emissions_raw]
    
    # Charts: By Source
    source_emissions_raw = db.query(
        EmissionFactor.source_name,
        func.sum(CarbonTransaction.calculated_emission).label("total")
    ).join(CarbonTransaction).group_by(EmissionFactor.id).all()
    
    source_emissions = [EmissionBySource(source=row.source_name, emissions=round(row.total or 0, 2)) for row in source_emissions_raw]
    
    charts = ChartsData(
        emissions_by_department=dept_emissions,
        emissions_by_source=source_emissions
    )
    
    # Recent Transactions
    recent_txs = db.query(CarbonTransaction).order_by(CarbonTransaction.transaction_date.desc()).limit(5).all()
    
    # Mapping to correct nested keys for response
    # Our schema uses 'emission_source' but the model uses 'emission_factor', so we will handle that in the router via schema validation alias or by explicit conversion
    
    return DashboardData(
        summary=summary,
        charts=charts,
        recent_transactions=recent_txs  # Pydantic will serialize this list using RecentTransactionData
    )
