from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime
from app.models.csr_activity import CSRActivityStatus

class CSRActivityNestedCategory(BaseModel):
    id: int
    name: str
    model_config = {"from_attributes": True}

class CSRActivityBase(BaseModel):
    title: str = Field(..., min_length=1, description="Title of the CSR Activity")
    category_id: int
    description: Optional[str] = None
    location: Optional[str] = None
    activity_date: date
    status: Optional[CSRActivityStatus] = CSRActivityStatus.PLANNED

class CSRActivityCreate(CSRActivityBase):
    pass

class CSRActivityUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1)
    category_id: Optional[int] = None
    description: Optional[str] = None
    location: Optional[str] = None
    activity_date: Optional[date] = None
    status: Optional[CSRActivityStatus] = None

class CSRActivityResponse(BaseModel):
    id: int
    title: str
    category: CSRActivityNestedCategory
    description: Optional[str] = None
    location: Optional[str] = None
    activity_date: date
    status: CSRActivityStatus
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
