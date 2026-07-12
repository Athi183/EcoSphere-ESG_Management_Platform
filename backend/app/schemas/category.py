from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.category import CategoryType, CategoryStatus

class CategoryBase(BaseModel):
    name: str
    type: CategoryType
    status: Optional[CategoryStatus] = CategoryStatus.ACTIVE

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[CategoryType] = None
    status: Optional[CategoryStatus] = None

class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
