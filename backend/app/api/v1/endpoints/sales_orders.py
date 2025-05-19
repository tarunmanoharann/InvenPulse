from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from app.db.base import get_database
from app.models.sales_order import (
    SalesOrderCreate,
    SalesOrderUpdate,
    SalesOrder,
    SalesOrderWithDetails,
    SalesOrderItemUpdate,
    SalesOrderItem
)
from app.crud.sales_order import SalesOrderCRUD
from app.core.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=SalesOrder)
async def create_sales_order(
    order: SalesOrderCreate,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Create a new sales order.
    """
    sales_order_crud = SalesOrderCRUD(db)
    return await sales_order_crud.create(order, current_user["id"])

@router.get("/", response_model=List[SalesOrder])
async def list_sales_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    status: Optional[str] = None,
    customer_id: Optional[str] = None,
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Retrieve sales orders with optional filtering.
    """
    sales_order_crud = SalesOrderCRUD(db)
    return await sales_order_crud.get_all(
        skip=skip,
        limit=limit,
        status=status,
        customer_id=customer_id,
        from_date=from_date,
        to_date=to_date
    )

@router.get("/stats")
async def get_sales_order_stats(
    customer_id: Optional[str] = None,
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Get sales statistics including total orders, revenue, items sold, and status breakdown.
    """
    sales_order_crud = SalesOrderCRUD(db)
    return await sales_order_crud.get_stats(
        customer_id=customer_id,
        from_date=from_date,
        to_date=to_date
    )

@router.get("/{order_id}", response_model=SalesOrder)
async def get_sales_order(
    order_id: str,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Get a specific sales order by ID.
    """
    sales_order_crud = SalesOrderCRUD(db)
    order = await sales_order_crud.get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Sales order not found")
    return order

@router.get("/{order_id}/details", response_model=SalesOrderWithDetails)
async def get_sales_order_details(
    order_id: str,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Get detailed information about a sales order including customer details and item details.
    """
    sales_order_crud = SalesOrderCRUD(db)
    order = await sales_order_crud.get_with_details(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Sales order not found")
    return order

@router.put("/{order_id}", response_model=SalesOrder)
async def update_sales_order(
    order_id: str,
    order: SalesOrderUpdate,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Update a sales order.
    """
    sales_order_crud = SalesOrderCRUD(db)
    updated_order = await sales_order_crud.update(order_id, order)
    if not updated_order:
        raise HTTPException(status_code=404, detail="Sales order not found")
    return updated_order

@router.put("/{order_id}/items/{item_id}", response_model=SalesOrderItem)
async def update_sales_order_item(
    order_id: str,
    item_id: str,
    item: SalesOrderItemUpdate,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Update a specific item in a sales order.
    """
    sales_order_crud = SalesOrderCRUD(db)
    updated_item = await sales_order_crud.update_item(order_id, item_id, item)
    if not updated_item:
        raise HTTPException(status_code=404, detail="Sales order item not found")
    return updated_item

@router.delete("/{order_id}")
async def delete_sales_order(
    order_id: str,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Delete a sales order and its items.
    """
    sales_order_crud = SalesOrderCRUD(db)
    success = await sales_order_crud.delete(order_id)
    if not success:
        raise HTTPException(status_code=404, detail="Sales order not found")
    return {"message": "Sales order successfully deleted"} 