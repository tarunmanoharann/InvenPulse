from typing import Optional, List, Dict
from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId
from app.models.product import PyObjectId

class NotificationBase(BaseModel):
    type: str = Field(..., regex="^(low_stock|order_status|price_change|expiry|system)$")
    priority: str = Field(..., regex="^(low|medium|high|critical)$")
    title: str
    message: str
    reference_type: Optional[str] = Field(None, regex="^(product|purchase_order|sales_order|inventory|system)$")
    reference_id: Optional[PyObjectId] = None
    metadata: Optional[Dict] = None  # Additional data specific to notification type
    is_read: bool = False
    is_archived: bool = False

class NotificationCreate(NotificationBase):
    recipient_ids: List[PyObjectId]  # List of user IDs to notify

class NotificationUpdate(BaseModel):
    is_read: Optional[bool] = None
    is_archived: Optional[bool] = None

class Notification(NotificationBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    recipient_id: PyObjectId  # Individual recipient (split from NotificationCreate)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    read_at: Optional[datetime] = None
    archived_at: Optional[datetime] = None

    class Config:
        json_encoders = {ObjectId: str}
        allow_population_by_field_name = True

class NotificationWithDetails(Notification):
    reference_details: Optional[Dict] = None  # Details of referenced entity
    recipient_details: Dict  # Basic recipient info (name, email, etc.)

class NotificationPreferences(BaseModel):
    user_id: PyObjectId
    email_notifications: bool = True
    push_notifications: bool = True
    notification_types: Dict[str, bool] = Field(
        default_factory=lambda: {
            "low_stock": True,
            "order_status": True,
            "price_change": True,
            "expiry": True,
            "system": True
        }
    )
    minimum_priority: str = Field(default="low", regex="^(low|medium|high|critical)$")

    class Config:
        json_encoders = {ObjectId: str}

class NotificationTemplate(BaseModel):
    type: str
    title_template: str
    message_template: str
    default_priority: str = Field(default="medium", regex="^(low|medium|high|critical)$")
    metadata_schema: Optional[Dict] = None  # JSON schema for metadata validation

class BulkNotificationCreate(BaseModel):
    type: str = Field(..., regex="^(low_stock|order_status|price_change|expiry|system)$")
    priority: str = Field(..., regex="^(low|medium|high|critical)$")
    title: str
    message: str
    reference_type: Optional[str] = None
    reference_id: Optional[PyObjectId] = None
    metadata: Optional[Dict] = None
    recipient_filter: Dict  # Query to filter recipients (e.g., by role, department)

class NotificationStats(BaseModel):
    total_count: int = 0
    unread_count: int = 0
    priority_counts: Dict[str, int] = Field(
        default_factory=lambda: {
            "low": 0,
            "medium": 0,
            "high": 0,
            "critical": 0
        }
    )
    type_counts: Dict[str, int] = Field(
        default_factory=lambda: {
            "low_stock": 0,
            "order_status": 0,
            "price_change": 0,
            "expiry": 0,
            "system": 0
        }
    ) 