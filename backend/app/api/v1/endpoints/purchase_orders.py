from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from app.db.base import get_database
from app.models.purchase_order import (
    PurchaseOrderCreate,
    PurchaseOrderUpdate,
    PurchaseOrder,
    PurchaseOrderWithDetails,
    PurchaseOrderItemUpdate,
    PurchaseOrderItem
)
from app.crud.purchase_order import PurchaseOrderCRUD
from app.core.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=PurchaseOrder)
async def create_purchase_order(
    order: PurchaseOrderCreate,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Create a new purchase order.
    """
    purchase_order_crud = PurchaseOrderCRUD(db)
    return await purchase_order_crud.create(order, current_user["id"])

@router.get("/", response_model=List[PurchaseOrder])
async def list_purchase_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    status: Optional[str] = None,
    supplier_id: Optional[str] = None,
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Retrieve purchase orders with optional filtering.
    """
    purchase_order_crud = PurchaseOrderCRUD(db)
    return await purchase_order_crud.get_all(
        skip=skip,
        limit=limit,
        status=status,
        supplier_id=supplier_id,
        from_date=from_date,
        to_date=to_date
    )

@router.get("/stats")
async def get_purchase_order_stats(
    supplier_id: Optional[str] = None,
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Get purchase order statistics.
    """
    purchase_order_crud = PurchaseOrderCRUD(db)
    return await purchase_order_crud.get_stats(
        supplier_id=supplier_id,
        from_date=from_date,
        to_date=to_date
    )

@router.get("/{order_id}", response_model=PurchaseOrder)
async def get_purchase_order(
    order_id: str,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Get a specific purchase order by ID.
    """
    purchase_order_crud = PurchaseOrderCRUD(db)
    order = await purchase_order_crud.get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    return order

@router.get("/{order_id}/details", response_model=PurchaseOrderWithDetails)
async def get_purchase_order_details(
    order_id: str,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Get detailed information about a purchase order including supplier details and item status.
    """
    purchase_order_crud = PurchaseOrderCRUD(db)
    order = await purchase_order_crud.get_with_details(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    return order

@router.put("/{order_id}", response_model=PurchaseOrder)
async def update_purchase_order(
    order_id: str,
    order: PurchaseOrderUpdate,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Update a purchase order.
    """
    purchase_order_crud = PurchaseOrderCRUD(db)
    updated_order = await purchase_order_crud.update(order_id, order)
    if not updated_order:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    return updated_order

@router.put("/{order_id}/items/{item_id}", response_model=PurchaseOrderItem)
async def update_purchase_order_item(
    order_id: str,
    item_id: str,
    item: PurchaseOrderItemUpdate,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Update a specific item in a purchase order.
    """
    purchase_order_crud = PurchaseOrderCRUD(db)
    updated_item = await purchase_order_crud.update_item(order_id, item_id, item)
    if not updated_item:
        raise HTTPException(status_code=404, detail="Purchase order item not found")
    return updated_item

@router.delete("/{order_id}")
async def delete_purchase_order(
    order_id: str,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Delete a purchase order and its items.
    """
    purchase_order_crud = PurchaseOrderCRUD(db)
    success = await purchase_order_crud.delete(order_id)
    if not success:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    return {"message": "Purchase order successfully deleted"} 