from pydantic import BaseModel, Field, computed_field
from typing import Optional
from datetime import datetime

class CarbonTransactionCreate(BaseModel):
    department_id: int
    emission_factor_id: int
    quantity: float = Field(..., gt=0, description="Quantity must be strictly positive")
    transaction_date: Optional[datetime] = None
    remarks: Optional[str] = None

class DepartmentNested(BaseModel):
    id: int
    name: str
    model_config = {"from_attributes": True}

class EmissionSourceNested(BaseModel):
    id: int
    source_name: str
    unit: str
    emission_factor: float
    model_config = {"from_attributes": True}

class CarbonTransactionResponse(BaseModel):
    id: int
    department: DepartmentNested
    emission_source: EmissionSourceNested = Field(alias="emission_factor")
    quantity: float
    calculated_emission: float
    transaction_date: datetime
    remarks: Optional[str] = None
    created_at: datetime
    
    @computed_field
    @property
    def carbon_intensity(self) -> float:
        if self.quantity > 0:
            return round(self.calculated_emission / self.quantity, 2)
        return 0.0

    model_config = {"from_attributes": True, "populate_by_name": True}
