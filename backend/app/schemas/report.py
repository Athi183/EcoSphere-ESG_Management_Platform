from pydantic import BaseModel
from typing import List
from app.schemas.dashboard import ChartsData, RecentTransactionData
from app.schemas.csr_activity import CSRActivityResponse
from app.schemas.policy import ESGPolicyResponse

# ----------------- Environmental -----------------
class EnvironmentalSummary(BaseModel):
    total_emissions: float
    total_transactions: int
    average_emission: float
    top_department: str
    top_emission_source: str
    
class EnvironmentalReport(BaseModel):
    summary: EnvironmentalSummary
    charts: ChartsData
    recent_transactions: List[RecentTransactionData]
    
# ----------------- Social -----------------
class SocialSummary(BaseModel):
    total_activities: int
    planned: int
    ongoing: int
    completed: int
    cancelled: int
    
class SocialReport(BaseModel):
    summary: SocialSummary
    recent_activities: List[CSRActivityResponse]
    
# ----------------- Governance -----------------
class GovernanceSummary(BaseModel):
    total_policies: int
    draft: int
    active: int
    archived: int
    
class GovernanceReport(BaseModel):
    summary: GovernanceSummary
    recent_policies: List[ESGPolicyResponse]

# ----------------- ESG Summary -----------------
class ESGSummaryReport(BaseModel):
    environmental: EnvironmentalReport
    social: SocialReport
    governance: GovernanceReport
