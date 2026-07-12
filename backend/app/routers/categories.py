from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.routers.auth import get_current_user
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.services import category as category_service

router = APIRouter(
    prefix="/categories", 
    tags=["categories"], 
    dependencies=[Depends(get_current_user)]
)

@router.post("", summary="Create a new category", description="Creates a new category. Fails if the combination of name and type already exists.")
def create_category(cat_in: CategoryCreate, db: Session = Depends(get_db)):
    if category_service.get_category_by_name_and_type(db, cat_in.name, cat_in.type):
        return {"success": False, "message": "Category with this name and type already exists", "data": {}}
    
    cat = category_service.create_category(db, cat_in)
    return {"success": True, "message": "Category created successfully", "data": CategoryResponse.model_validate(cat).model_dump()}

@router.get("", summary="List all categories", description="Retrieves a paginated list of categories.")
def read_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    total, items = category_service.get_categories(db, skip=skip, limit=limit)
    items_data = [CategoryResponse.model_validate(item).model_dump() for item in items]
    return {"success": True, "message": "Categories fetched successfully", "data": {"items": items_data, "total": total}}

@router.get("/{category_id}", summary="Get category by ID", description="Fetches a specific category by its ID.")
def read_category(category_id: int, db: Session = Depends(get_db)):
    cat = category_service.get_category_by_id(db, category_id)
    if not cat:
        return {"success": False, "message": "Category not found", "data": {}}
    return {"success": True, "message": "Category fetched successfully", "data": CategoryResponse.model_validate(cat).model_dump()}

@router.put("/{category_id}", summary="Update a category", description="Updates category fields. Verifies that the new name/type combination does not conflict with an existing category.")
def update_category(category_id: int, cat_in: CategoryUpdate, db: Session = Depends(get_db)):
    cat = category_service.get_category_by_id(db, category_id)
    if not cat:
        return {"success": False, "message": "Category not found", "data": {}}
    
    # We only need to check uniqueness if name or type are being changed
    new_name = cat_in.name if cat_in.name is not None else cat.name
    new_type = cat_in.type if cat_in.type is not None else cat.type
    
    if (new_name != cat.name) or (new_type != cat.type):
        if category_service.get_category_by_name_and_type(db, new_name, new_type):
            return {"success": False, "message": "Category with this name and type already exists", "data": {}}
            
    updated_cat = category_service.update_category(db, cat, cat_in)
    return {"success": True, "message": "Category updated successfully", "data": CategoryResponse.model_validate(updated_cat).model_dump()}

@router.delete("/{category_id}", summary="Delete a category", description="Deletes a specific category by its ID.")
def delete_category(category_id: int, response: Response, db: Session = Depends(get_db)):
    cat = category_service.get_category_by_id(db, category_id)
    if not cat:
        response.status_code = 404
        return {"success": False, "message": "Category not found", "data": {}}
    
    err = category_service.delete_category(db, cat)
    if err:
        response.status_code = 400
        return {"success": False, "message": err, "data": {}}
        
    return {"success": True, "message": "Category deleted successfully", "data": {}}
