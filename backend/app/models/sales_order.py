from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field
from bson import ObjectId

class SalesOrderItem(BaseModel):
    product_id: str
    quantity: int = Field(gt=0)
    unit_price: float = Field(gt=0)
    discount: float = Field(ge=0, le=100, default=0)
    status: str = Field(default="pending")  # pending, shipped, delivered, cancelled
    notes: Optional[str] = None

class SalesOrderBase(BaseModel):
    customer_id: str
    items: List[SalesOrderItem]
    status: str = Field(default="draft")  # draft, confirmed, processing, shipped, delivered, cancelled
    shipping_address: dict
    billing_address: dict
    payment_method: str
    shipping_method: str
    notes: Optional[str] = None
    total_amount: float = Field(gt=0)
    discount: float = Field(ge=0, le=100, default=0)
    tax: float = Field(ge=0, default=0)
    shipping_cost: float = Field(ge=0, default=0)

class SalesOrderCreate(SalesOrderBase):
    pass

class SalesOrderUpdate(BaseModel):
    status: Optional[str] = None
    shipping_address: Optional[dict] = None
    billing_address: Optional[dict] = None
    payment_method: Optional[str] = None
    shipping_method: Optional[str] = None
    notes: Optional[str] = None
    discount: Optional[float] = Field(None, ge=0, le=100)
    tax: Optional[float] = Field(None, ge=0)
    shipping_cost: Optional[float] = Field(None, ge=0)

class SalesOrderItemUpdate(BaseModel):
    quantity: Optional[int] = Field(None, gt=0)
    unit_price: Optional[float] = Field(None, gt=0)
    discount: Optional[float] = Field(None, ge=0, le=100)
    status: Optional[str] = None
    notes: Optional[str] = None

class SalesOrder(SalesOrderBase):
    id: str
    created_at: datetime
    updated_at: datetime
    created_by: str
    total_items: int
    final_amount: float  # total_amount - discount + tax + shipping_cost

class SalesOrderWithDetails(SalesOrder):
    customer_details: dict
    items_details: List[dict]  # Includes product details for each item
    status_history: List[dict] 