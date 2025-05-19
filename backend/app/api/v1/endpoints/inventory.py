from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from app.db.base import get_database
from app.models.inventory_transaction import (
    InventoryTransaction,
    InventoryTransactionCreate,
    InventoryTransactionWithDetails,
    InventoryBalance,
    InventoryAdjustment,
    InventoryTransfer,
    InventoryCount
)
from app.crud.inventory_transaction import InventoryTransactionCRUD
from app.core.auth import get_current_user

router = APIRouter()

@router.post("/transactions", response_model=InventoryTransaction)
async def create_transaction(
    transaction: InventoryTransactionCreate,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Create a new inventory transaction.
    """
    inventory_crud = InventoryTransactionCRUD(db)
    return await inventory_crud.create(transaction, current_user["id"])

@router.get("/transactions", response_model=List[InventoryTransaction])
async def list_transactions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    product_id: Optional[str] = None,
    location_id: Optional[str] = None,
    transaction_type: Optional[str] = None,
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    List inventory transactions with optional filtering.
    """
    inventory_crud = InventoryTransactionCRUD(db)
    return await inventory_crud.get_all(
        skip=skip,
        limit=limit,
        product_id=product_id,
        location_id=location_id,
        transaction_type=transaction_type,
        from_date=from_date,
        to_date=to_date
    )

@router.get("/transactions/{transaction_id}", response_model=InventoryTransactionWithDetails)
async def get_transaction(
    transaction_id: str,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Get detailed information about a specific transaction.
    """
    inventory_crud = InventoryTransactionCRUD(db)
    transaction = await inventory_crud.get_with_details(transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction

@router.get("/balances/{product_id}/{location_id}", response_model=InventoryBalance)
async def get_balance(
    product_id: str,
    location_id: str,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Get current inventory balance for a product at a specific location.
    """
    inventory_crud = InventoryTransactionCRUD(db)
    balance = await inventory_crud.get_balance(product_id, location_id)
    if not balance:
        raise HTTPException(
            status_code=404,
            detail="No balance found for this product at this location"
        )
    return balance

@router.post("/adjustments", response_model=InventoryTransaction)
async def create_adjustment(
    adjustment: InventoryAdjustment,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Create an inventory adjustment transaction.
    """
    inventory_crud = InventoryTransactionCRUD(db)
    transaction, _ = await inventory_crud.process_adjustment(
        adjustment,
        current_user["id"]
    )
    if not transaction:
        raise HTTPException(
            status_code=400,
            detail="No adjustment needed (actual quantity equals system quantity)"
        )
    return transaction

@router.post("/transfers", response_model=List[InventoryTransaction])
async def create_transfer(
    transfer: InventoryTransfer,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Create an inventory transfer between locations.
    """
    inventory_crud = InventoryTransactionCRUD(db)
    from_transaction, to_transaction = await inventory_crud.process_transfer(
        transfer,
        current_user["id"]
    )
    return [from_transaction, to_transaction]

@router.post("/counts", response_model=List[InventoryTransaction])
async def create_count(
    count: InventoryCount,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Process inventory count results and create adjustment transactions.
    """
    inventory_crud = InventoryTransactionCRUD(db)
    transactions = await inventory_crud.process_count(count, current_user["id"])
    return transactions

@router.get("/movements/product/{product_id}", response_model=List[InventoryTransaction])
async def get_product_movements(
    product_id: str,
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Get all movements for a specific product.
    """
    inventory_crud = InventoryTransactionCRUD(db)
    return await inventory_crud.get_product_movements(
        product_id,
        from_date,
        to_date
    )

@router.get("/movements/location/{location_id}", response_model=List[InventoryTransaction])
async def get_location_movements(
    location_id: str,
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Get all movements for a specific location.
    """
    inventory_crud = InventoryTransactionCRUD(db)
    return await inventory_crud.get_location_movements(
        location_id,
        from_date,
        to_date
    ) 