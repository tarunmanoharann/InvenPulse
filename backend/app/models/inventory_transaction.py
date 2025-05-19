from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId
from app.models.product import PyObjectId

class InventoryTransactionBase(BaseModel):
    product_id: PyObjectId
    quantity: float = Field(..., description="Positive for additions, negative for deductions")
    transaction_type: str = Field(..., regex="^(purchase|sale|adjustment|transfer|count)$")
    reference_type: Optional[str] = Field(None, regex="^(purchase_order|sales_order|adjustment|transfer|count)$")
    reference_id: Optional[PyObjectId] = None
    location_id: PyObjectId
    to_location_id: Optional[PyObjectId] = None  # For transfers
    unit_cost: Optional[float] = Field(None, ge=0)
    reason: Optional[str] = None
    notes: Optional[str] = None

class InventoryTransactionCreate(InventoryTransactionBase):
    pass

class InventoryTransactionUpdate(BaseModel):
    quantity: Optional[float] = None
    unit_cost: Optional[float] = Field(None, ge=0)
    reason: Optional[str] = None
    notes: Optional[str] = None

class InventoryTransaction(InventoryTransactionBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    created_by: PyObjectId
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    running_balance: float = 0.0  # Running balance after this transaction
    value: float = 0.0  # Transaction value (quantity * unit_cost)

    class Config:
        json_encoders = {ObjectId: str}
        allow_population_by_field_name = True

class InventoryTransactionWithDetails(InventoryTransaction):
    product_details: dict
    location_details: dict
    to_location_details: Optional[dict] = None
    reference_details: Optional[dict] = None

class InventoryBalance(BaseModel):
    product_id: PyObjectId
    location_id: PyObjectId
    quantity: float = 0.0
    value: float = 0.0  # Total value of inventory at this location
    last_transaction_date: Optional[datetime] = None
    last_count_date: Optional[datetime] = None

    class Config:
        json_encoders = {ObjectId: str}

class InventoryAdjustment(BaseModel):
    product_id: PyObjectId
    location_id: PyObjectId
    actual_quantity: float
    system_quantity: float
    adjustment_reason: str
    notes: Optional[str] = None

class InventoryTransfer(BaseModel):
    product_id: PyObjectId
    from_location_id: PyObjectId
    to_location_id: PyObjectId
    quantity: float = Field(..., gt=0)
    reason: Optional[str] = None
    notes: Optional[str] = None

class InventoryCount(BaseModel):
    location_id: PyObjectId
    products: List[dict]  # List of {product_id, counted_quantity, system_quantity}
    count_date: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="draft")  # draft, in_progress, completed
    notes: Optional[str] = None 