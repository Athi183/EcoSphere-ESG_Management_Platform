from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.routers.auth import get_current_user
from app.schemas.department import DepartmentCreate, DepartmentUpdate, DepartmentResponse
from app.services import department as dept_service

router = APIRouter(
    prefix="/departments", 
    tags=["departments"], 
    dependencies=[Depends(get_current_user)]
)

@router.post("")
def create_department(dept_in: DepartmentCreate, db: Session = Depends(get_db)):
    if dept_service.get_department_by_name(db, dept_in.name):
        return {"success": False, "message": "Department name already exists", "data": {}}
    if dept_service.get_department_by_code(db, dept_in.code):
        return {"success": False, "message": "Department code already exists", "data": {}}
    
    dept = dept_service.create_department(db, dept_in)
    return {"success": True, "message": "Department created successfully", "data": DepartmentResponse.model_validate(dept).model_dump()}

@router.get("")
def read_departments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    total, items = dept_service.get_departments(db, skip=skip, limit=limit)
    items_data = [DepartmentResponse.model_validate(item).model_dump() for item in items]
    return {"success": True, "message": "Departments fetched successfully", "data": {"items": items_data, "total": total}}

@router.get("/{dept_id}")
def read_department(dept_id: int, db: Session = Depends(get_db)):
    dept = dept_service.get_department_by_id(db, dept_id)
    if not dept:
        return {"success": False, "message": "Department not found", "data": {}}
    return {"success": True, "message": "Department fetched successfully", "data": DepartmentResponse.model_validate(dept).model_dump()}

@router.put("/{dept_id}")
def update_department(dept_id: int, dept_in: DepartmentUpdate, db: Session = Depends(get_db)):
    dept = dept_service.get_department_by_id(db, dept_id)
    if not dept:
        return {"success": False, "message": "Department not found", "data": {}}
    
    if dept_in.name is not None and dept_in.name != dept.name:
        if dept_service.get_department_by_name(db, dept_in.name):
            return {"success": False, "message": "Department name already exists", "data": {}}
    if dept_in.code is not None and dept_in.code != dept.code:
        if dept_service.get_department_by_code(db, dept_in.code):
            return {"success": False, "message": "Department code already exists", "data": {}}
            
    updated_dept = dept_service.update_department(db, dept, dept_in)
    return {"success": True, "message": "Department updated successfully", "data": DepartmentResponse.model_validate(updated_dept).model_dump()}

@router.delete("/{dept_id}")
def delete_department(dept_id: int, db: Session = Depends(get_db)):
    dept = dept_service.get_department_by_id(db, dept_id)
    if not dept:
        return {"success": False, "message": "Department not found", "data": {}}
    
    dept_service.delete_department(db, dept)
    return {"success": True, "message": "Department deleted successfully", "data": {}}
