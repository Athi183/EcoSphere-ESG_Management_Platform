from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.emission_factor import EmissionFactorStatus

class EmissionFactorBase(BaseModel):
    source_name: str = Field(..., min_length=1, description="The name of the emission source")
    unit: str = Field(..., min_length=1, description="The unit of measurement (e.g., kWh, litre)")
    emission_factor: float = Field(..., gt=0, description="The emission factor value, must be strictly positive")
    description: Optional[str] = None
    status: Optional[EmissionFactorStatus] = EmissionFactorStatus.ACTIVE

class EmissionFactorCreate(EmissionFactorBase):
    pass

class EmissionFactorUpdate(BaseModel):
    source_name: Optional[str] = Field(None, min_length=1)
    unit: Optional[str] = Field(None, min_length=1)
    emission_factor: Optional[float] = Field(None, gt=0)
    description: Optional[str] = None
    status: Optional[EmissionFactorStatus] = None

class EmissionFactorResponse(EmissionFactorBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
