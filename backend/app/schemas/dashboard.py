from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class SummaryData(BaseModel):
    total_emissions: float
    total_transactions: int
    active_departments: int
    top_department: str
    top_emission_source: str
    average_emission_per_transaction: float

class EmissionByDepartment(BaseModel):
    department: str
    emissions: float

class EmissionBySource(BaseModel):
    source: str
    emissions: float

class ChartsData(BaseModel):
    emissions_by_department: List[EmissionByDepartment]
    emissions_by_source: List[EmissionBySource]

class DashboardDepartmentNested(BaseModel):
    name: str
    model_config = {"from_attributes": True}

class DashboardEmissionSourceNested(BaseModel):
    source_name: str
    unit: str
    model_config = {"from_attributes": True}

class RecentTransactionData(BaseModel):
    id: int
    department: DashboardDepartmentNested
    emission_source: DashboardEmissionSourceNested = Field(alias="emission_factor")
    quantity: float
    calculated_emission: float
    transaction_date: datetime
    model_config = {"from_attributes": True, "populate_by_name": True}

class DashboardData(BaseModel):
    summary: SummaryData
    charts: ChartsData
    recent_transactions: List[RecentTransactionData]
