from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorClient
from app.db.base import get_database
from app.models.supplier import SupplierCreate, SupplierUpdate, Supplier, SupplierWithStats
from app.crud.supplier import SupplierCRUD
from app.core.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=Supplier)
async def create_supplier(
    supplier: SupplierCreate,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Create a new supplier.
    """
    supplier_crud = SupplierCRUD(db)
    if supplier.email:
        existing_supplier = await supplier_crud.get_by_email(supplier.email)
        if existing_supplier:
            raise HTTPException(status_code=400, detail="Email already registered")
    return await supplier_crud.create(supplier)

@router.get("/", response_model=List[Supplier])
async def list_suppliers(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    status: Optional[str] = None,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Retrieve suppliers with optional status filtering.
    """
    supplier_crud = SupplierCRUD(db)
    return await supplier_crud.get_all(skip=skip, limit=limit, status=status)

@router.get("/search", response_model=List[Supplier])
async def search_suppliers(
    query: str = Query(..., min_length=1),
    limit: int = Query(10, ge=1, le=50),
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Search suppliers by name, contact person, or email.
    """
    supplier_crud = SupplierCRUD(db)
    return await supplier_crud.search(query, limit)

@router.get("/top", response_model=List[SupplierWithStats])
async def get_top_suppliers(
    limit: int = Query(5, ge=1, le=20),
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Get top suppliers based on order volume and performance.
    """
    supplier_crud = SupplierCRUD(db)
    return await supplier_crud.get_top_suppliers(limit)

@router.get("/{supplier_id}", response_model=Supplier)
async def get_supplier(
    supplier_id: str,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Get a specific supplier by ID.
    """
    supplier_crud = SupplierCRUD(db)
    supplier = await supplier_crud.get(supplier_id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return supplier

@router.get("/{supplier_id}/stats", response_model=SupplierWithStats)
async def get_supplier_stats(
    supplier_id: str,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Get supplier statistics including order history and performance metrics.
    """
    supplier_crud = SupplierCRUD(db)
    supplier = await supplier_crud.get_with_stats(supplier_id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return supplier

@router.put("/{supplier_id}", response_model=Supplier)
async def update_supplier(
    supplier_id: str,
    supplier: SupplierUpdate,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Update a supplier.
    """
    supplier_crud = SupplierCRUD(db)
    if supplier.email:
        existing_supplier = await supplier_crud.get_by_email(supplier.email)
        if existing_supplier and str(existing_supplier.id) != supplier_id:
            raise HTTPException(status_code=400, detail="Email already registered")
            
    updated_supplier = await supplier_crud.update(supplier_id, supplier)
    if not updated_supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return updated_supplier

@router.delete("/{supplier_id}")
async def delete_supplier(
    supplier_id: str,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Delete a supplier.
    """
    supplier_crud = SupplierCRUD(db)
    success = await supplier_crud.delete(supplier_id)
    if not success:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return {"message": "Supplier successfully deleted"} 