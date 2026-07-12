from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.department import DepartmentStatus

class DepartmentBase(BaseModel):
    name: str
    code: str
    head_name: Optional[str] = None
    parent_department_id: Optional[int] = None
    employee_count: Optional[int] = 0
    status: Optional[DepartmentStatus] = DepartmentStatus.ACTIVE

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    head_name: Optional[str] = None
    parent_department_id: Optional[int] = None
    employee_count: Optional[int] = None
    status: Optional[DepartmentStatus] = None

class DepartmentResponse(DepartmentBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
