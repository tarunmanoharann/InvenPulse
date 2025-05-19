from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from app.db.base import get_database
from app.models.notification import (
    Notification,
    NotificationCreate,
    NotificationUpdate,
    NotificationWithDetails,
    NotificationPreferences,
    BulkNotificationCreate,
    NotificationStats
)
from app.crud.notification import NotificationCRUD
from app.core.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=List[Notification])
async def create_notification(
    notification: NotificationCreate,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Create a new notification for multiple recipients.
    """
    notification_crud = NotificationCRUD(db)
    return await notification_crud.create(notification)

@router.post("/bulk", response_model=List[Notification])
async def create_bulk_notification(
    notification: BulkNotificationCreate,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Create notifications for users matching filter criteria.
    """
    notification_crud = NotificationCRUD(db)
    return await notification_crud.create_bulk(notification)

@router.get("/me", response_model=List[Notification])
async def get_my_notifications(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    include_archived: bool = False,
    type: Optional[str] = None,
    priority: Optional[str] = None,
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Get notifications for the current user with filtering options.
    """
    notification_crud = NotificationCRUD(db)
    return await notification_crud.get_user_notifications(
        current_user["id"],
        skip=skip,
        limit=limit,
        include_archived=include_archived,
        type=type,
        priority=priority,
        from_date=from_date,
        to_date=to_date
    )

@router.get("/me/stats", response_model=NotificationStats)
async def get_my_notification_stats(
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Get notification statistics for the current user.
    """
    notification_crud = NotificationCRUD(db)
    return await notification_crud.get_stats(
        current_user["id"],
        from_date=from_date,
        to_date=to_date
    )

@router.get("/{notification_id}", response_model=NotificationWithDetails)
async def get_notification(
    notification_id: str,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Get detailed information about a specific notification.
    """
    notification_crud = NotificationCRUD(db)
    notification = await notification_crud.get_with_details(notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    # Ensure user can only access their own notifications
    if str(notification["recipient_id"]) != current_user["id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return notification

@router.put("/{notification_id}", response_model=Notification)
async def update_notification(
    notification_id: str,
    update: NotificationUpdate,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Update notification status (read/archived).
    """
    notification_crud = NotificationCRUD(db)
    updated = await notification_crud.update(
        notification_id,
        current_user["id"],
        update
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Notification not found")
    return updated

@router.post("/mark-all-read")
async def mark_all_notifications_read(
    notification_type: Optional[str] = None,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Mark all notifications as read for the current user.
    """
    notification_crud = NotificationCRUD(db)
    count = await notification_crud.mark_all_read(
        current_user["id"],
        notification_type
    )
    return {"message": f"Marked {count} notifications as read"}

@router.get("/preferences/me", response_model=NotificationPreferences)
async def get_my_preferences(
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Get notification preferences for the current user.
    """
    notification_crud = NotificationCRUD(db)
    preferences = await notification_crud.get_user_preferences(current_user["id"])
    if not preferences:
        # Return default preferences if none set
        return NotificationPreferences(user_id=current_user["id"])
    return preferences

@router.put("/preferences/me", response_model=NotificationPreferences)
async def update_my_preferences(
    preferences: NotificationPreferences,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Update notification preferences for the current user.
    """
    if preferences.user_id != current_user["id"]:
        raise HTTPException(
            status_code=400,
            detail="User ID in preferences must match the current user"
        )

    notification_crud = NotificationCRUD(db)
    return await notification_crud.update_preferences(
        current_user["id"],
        preferences
    ) 