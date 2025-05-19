from typing import Optional, List
from pydantic import BaseModel, Field, validator
from datetime import datetime
from bson import ObjectId
from decimal import Decimal
from app.models.product import PyObjectId

class PurchaseOrderItemBase(BaseModel):
    product_id: PyObjectId
    quantity: int = Field(..., gt=0)
    unit_price: float = Field(..., gt=0)
    received_quantity: int = Field(default=0, ge=0)
    notes: Optional[str] = None

class PurchaseOrderItemCreate(PurchaseOrderItemBase):
    pass

class PurchaseOrderItemUpdate(BaseModel):
    quantity: Optional[int] = Field(None, gt=0)
    unit_price: Optional[float] = Field(None, gt=0)
    received_quantity: Optional[int] = Field(None, ge=0)
    notes: Optional[str] = None

class PurchaseOrderItemInDB(PurchaseOrderItemBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    purchase_order_id: PyObjectId
    total_amount: float = 0.0
    status: str = "pending"  # pending, partially_received, received
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {ObjectId: str}
        allow_population_by_field_name = True

    @validator("total_amount", pre=True, always=True)
    def calculate_total_amount(cls, v, values):
        if "quantity" in values and "unit_price" in values:
            return round(values["quantity"] * values["unit_price"], 2)
        return v

    @validator("status", pre=True, always=True)
    def calculate_status(cls, v, values):
        if "quantity" in values and "received_quantity" in values:
            if values["received_quantity"] == 0:
                return "pending"
            elif values["received_quantity"] < values["quantity"]:
                return "partially_received"
            else:
                return "received"
        return v

class PurchaseOrderBase(BaseModel):
    supplier_id: PyObjectId
    order_date: datetime = Field(default_factory=datetime.utcnow)
    expected_delivery_date: Optional[datetime] = None
    status: str = Field(..., regex="^(draft|confirmed|partially_received|received|cancelled)$")
    notes: Optional[str] = None

class PurchaseOrderCreate(PurchaseOrderBase):
    items: List[PurchaseOrderItemCreate]

class PurchaseOrderUpdate(BaseModel):
    expected_delivery_date: Optional[datetime] = None
    status: Optional[str] = Field(None, regex="^(draft|confirmed|partially_received|received|cancelled)$")
    notes: Optional[str] = None

class PurchaseOrderInDB(PurchaseOrderBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    items: List[PurchaseOrderItemInDB] = []
    total_amount: float = 0.0
    created_by: PyObjectId
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    delivery_date: Optional[datetime] = None

    class Config:
        json_encoders = {ObjectId: str}
        allow_population_by_field_name = True

    @validator("total_amount", pre=True, always=True)
    def calculate_total_amount(cls, v, values):
        if "items" in values:
            return round(sum(item.total_amount for item in values["items"]), 2)
        return v

class PurchaseOrderWithDetails(PurchaseOrderInDB):
    supplier_name: str
    items_count: int
    received_items_count: int
    is_overdue: bool = False
    days_until_delivery: Optional[int] = None

    @validator("is_overdue", pre=True, always=True)
    def calculate_overdue(cls, v, values):
        if "expected_delivery_date" in values and values["expected_delivery_date"]:
            return values["expected_delivery_date"] < datetime.utcnow()
        return False

    @validator("days_until_delivery", pre=True, always=True)
    def calculate_days_until_delivery(cls, v, values):
        if "expected_delivery_date" in values and values["expected_delivery_date"]:
            delta = values["expected_delivery_date"] - datetime.utcnow()
            return max(0, delta.days)
        return None

class PurchaseOrder(PurchaseOrderInDB):
    pass

class PurchaseOrderItem(PurchaseOrderItemInDB):
    pass 