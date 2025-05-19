from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorClient
from app.db.base import get_database
from app.models.category import CategoryCreate, CategoryUpdate, Category
from app.crud.category import CategoryCRUD
from app.core.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=Category)
async def create_category(
    category: CategoryCreate,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Create a new category.
    """
    category_crud = CategoryCRUD(db)
    existing_category = await category_crud.get_by_name(category.name)
    if existing_category:
        raise HTTPException(status_code=400, detail="Category name already exists")
    return await category_crud.create(category)

@router.get("/", response_model=List[Category])
async def list_categories(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    tree: bool = Query(False, description="Return categories in tree structure"),
    with_count: bool = Query(False, description="Include product count"),
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Retrieve categories with optional tree structure and product count.
    """
    category_crud = CategoryCRUD(db)
    
    if tree:
        return await category_crud.get_tree()
    elif with_count:
        return await category_crud.get_with_product_count()
    else:
        return await category_crud.get_all(skip=skip, limit=limit)

@router.get("/{category_id}", response_model=Category)
async def get_category(
    category_id: str,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Get a specific category by ID.
    """
    category_crud = CategoryCRUD(db)
    category = await category_crud.get(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.put("/{category_id}", response_model=Category)
async def update_category(
    category_id: str,
    category: CategoryUpdate,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Update a category.
    """
    category_crud = CategoryCRUD(db)
    try:
        updated_category = await category_crud.update(category_id, category)
        if not updated_category:
            raise HTTPException(status_code=404, detail="Category not found")
        return updated_category
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{category_id}")
async def delete_category(
    category_id: str,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Delete a category and reassign its children to the parent category.
    """
    category_crud = CategoryCRUD(db)
    success = await category_crud.delete(category_id)
    if not success:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category successfully deleted"} 