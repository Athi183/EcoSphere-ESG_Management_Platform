from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime
from app.models.policy import PolicyStatus

class ESGPolicyBase(BaseModel):
    title: str = Field(..., min_length=1, description="Title of the policy")
    description: Optional[str] = None
    version: str = Field(..., min_length=1, description="Version of the policy (e.g., '1.0')")
    effective_date: Optional[date] = None
    status: Optional[PolicyStatus] = PolicyStatus.DRAFT

class ESGPolicyCreate(ESGPolicyBase):
    pass

class ESGPolicyUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1)
    description: Optional[str] = None
    version: Optional[str] = Field(None, min_length=1)
    effective_date: Optional[date] = None
    status: Optional[PolicyStatus] = None

class ESGPolicyResponse(ESGPolicyBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
