from sqlalchemy.orm import Session
from app.models.department import Department
from app.schemas.department import DepartmentCreate, DepartmentUpdate

def get_departments(db: Session, skip: int = 0, limit: int = 100):
    total = db.query(Department).count()
    items = db.query(Department).offset(skip).limit(limit).all()
    return total, items

def get_department_by_id(db: Session, dept_id: int):
    return db.query(Department).filter(Department.id == dept_id).first()

def get_department_by_name(db: Session, name: str):
    return db.query(Department).filter(Department.name == name).first()

def get_department_by_code(db: Session, code: str):
    return db.query(Department).filter(Department.code == code).first()

def create_department(db: Session, dept_in: DepartmentCreate):
    db_dept = Department(
        name=dept_in.name,
        code=dept_in.code,
        head_name=dept_in.head_name,
        parent_department_id=dept_in.parent_department_id,
        employee_count=dept_in.employee_count,
        status=dept_in.status
    )
    db.add(db_dept)
    db.commit()
    db.refresh(db_dept)
    return db_dept

def update_department(db: Session, db_dept: Department, dept_in: DepartmentUpdate):
    update_data = dept_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_dept, key, value)
    db.commit()
    db.refresh(db_dept)
    return db_dept

def delete_department(db: Session, db_dept: Department):
    if db_dept.transactions:
        return "Cannot delete this department because it is referenced by existing carbon transactions."
    
    child_dept = db.query(Department).filter(Department.parent_department_id == db_dept.id).first()
    if child_dept:
        return "Cannot delete this department because it has child departments."
        
    db.delete(db_dept)
    db.commit()
    return None
