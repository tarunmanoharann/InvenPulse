from typing import Optional
from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from bson import ObjectId
from app.models.product import PyObjectId

class SupplierBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    contact_person: Optional[str] = Field(None, max_length=100)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=20)
    address: Optional[str] = None
    status: str = Field(..., regex="^(active|inactive|blacklisted)$")
    notes: Optional[str] = None

class SupplierCreate(SupplierBase):
    pass

class SupplierUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    contact_person: Optional[str] = Field(None, max_length=100)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=20)
    address: Optional[str] = None
    status: Optional[str] = Field(None, regex="^(active|inactive|blacklisted)$")
    notes: Optional[str] = None

class SupplierInDB(SupplierBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {ObjectId: str}
        allow_population_by_field_name = True

class SupplierWithStats(SupplierInDB):
    total_orders: int = 0
    total_amount: float = 0.0
    average_delivery_time: Optional[float] = None  # in days
    on_time_delivery_rate: Optional[float] = None  # percentage
    last_order_date: Optional[datetime] = None 