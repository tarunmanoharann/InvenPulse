from typing import List, Optional, Dict
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from app.models.notification import (
    NotificationCreate,
    NotificationUpdate,
    BulkNotificationCreate,
    NotificationPreferences,
    NotificationTemplate,
    NotificationStats
)

class NotificationCRUD:
    def __init__(self, db: AsyncIOMotorClient):
        self.db = db
        self.collection = db.inven_pulse.notifications
        self.preferences_collection = db.inven_pulse.notification_preferences
        self.templates_collection = db.inven_pulse.notification_templates

    async def create(self, notification: NotificationCreate) -> List[dict]:
        """Create notifications for multiple recipients."""
        notifications = []
        created_at = datetime.utcnow()

        # Create a notification for each recipient
        for recipient_id in notification.recipient_ids:
            notification_dict = notification.dict(exclude={"recipient_ids"})
            notification_dict["recipient_id"] = recipient_id
            notification_dict["created_at"] = created_at

            result = await self.collection.insert_one(notification_dict)
            notification_dict["id"] = str(result.inserted_id)
            notifications.append(notification_dict)

        return notifications

    async def create_bulk(
        self,
        notification: BulkNotificationCreate,
        user_filter: Optional[Dict] = None
    ) -> List[dict]:
        """Create notifications for users matching the filter criteria."""
        # Get users matching the filter
        users_collection = self.db.inven_pulse.users
        filter_query = {
            **notification.recipient_filter,
            **(user_filter or {})
        }
        
        users = await users_collection.find(
            filter_query,
            {"_id": 1}  # Only get user IDs
        ).to_list(length=None)

        if not users:
            return []

        # Create notification for matched users
        notification_create = NotificationCreate(
            type=notification.type,
            priority=notification.priority,
            title=notification.title,
            message=notification.message,
            reference_type=notification.reference_type,
            reference_id=notification.reference_id,
            metadata=notification.metadata,
            recipient_ids=[user["_id"] for user in users]
        )

        return await self.create(notification_create)

    async def get(self, notification_id: str) -> Optional[dict]:
        """Get a single notification by ID."""
        if not ObjectId.is_valid(notification_id):
            return None

        notification = await self.collection.find_one(
            {"_id": ObjectId(notification_id)}
        )
        if notification:
            notification["id"] = str(notification.pop("_id"))
            return notification
        return None

    async def get_with_details(self, notification_id: str) -> Optional[dict]:
        """Get notification with referenced entity details."""
        if not ObjectId.is_valid(notification_id):
            return None

        pipeline = [
            {"$match": {"_id": ObjectId(notification_id)}},
            {
                "$lookup": {
                    "from": "users",
                    "localField": "recipient_id",
                    "foreignField": "_id",
                    "as": "recipient_details"
                }
            },
            {"$unwind": "$recipient_details"},
            {
                "$project": {
                    "recipient_details.password": 0,
                    "recipient_details.salt": 0
                }
            }
        ]

        result = await self.collection.aggregate(pipeline).to_list(1)
        if not result:
            return None

        notification = result[0]
        notification["id"] = str(notification.pop("_id"))

        # Add reference details if available
        if notification.get("reference_id") and notification.get("reference_type"):
            reference = await self._get_reference_details(
                notification["reference_type"],
                notification["reference_id"]
            )
            if reference:
                notification["reference_details"] = reference

        return notification

    async def get_user_notifications(
        self,
        user_id: str,
        skip: int = 0,
        limit: int = 50,
        include_archived: bool = False,
        type: Optional[str] = None,
        priority: Optional[str] = None,
        from_date: Optional[datetime] = None,
        to_date: Optional[datetime] = None
    ) -> List[dict]:
        """Get notifications for a specific user with filtering."""
        if not ObjectId.is_valid(user_id):
            return []

        query = {"recipient_id": ObjectId(user_id)}
        
        if not include_archived:
            query["is_archived"] = False
        
        if type:
            query["type"] = type
        if priority:
            query["priority"] = priority
        if from_date or to_date:
            query["created_at"] = {}
            if from_date:
                query["created_at"]["$gte"] = from_date
            if to_date:
                query["created_at"]["$lte"] = to_date

        cursor = self.collection.find(query).sort(
            "created_at", -1
        ).skip(skip).limit(limit)
        
        notifications = await cursor.to_list(length=limit)
        for notification in notifications:
            notification["id"] = str(notification.pop("_id"))
        return notifications

    async def update(
        self,
        notification_id: str,
        user_id: str,
        update: NotificationUpdate
    ) -> Optional[dict]:
        """Update notification status (read/archived)."""
        if not ObjectId.is_valid(notification_id):
            return None

        update_data = update.dict(exclude_unset=True)
        if not update_data:
            return None

        # Add timestamps for status changes
        now = datetime.utcnow()
        if "is_read" in update_data and update_data["is_read"]:
            update_data["read_at"] = now
        if "is_archived" in update_data and update_data["is_archived"]:
            update_data["archived_at"] = now

        result = await self.collection.find_one_and_update(
            {
                "_id": ObjectId(notification_id),
                "recipient_id": ObjectId(user_id)
            },
            {"$set": update_data},
            return_document=True
        )

        if result:
            result["id"] = str(result.pop("_id"))
            return result
        return None

    async def mark_all_read(
        self,
        user_id: str,
        notification_type: Optional[str] = None
    ) -> int:
        """Mark all notifications as read for a user."""
        if not ObjectId.is_valid(user_id):
            return 0

        query = {
            "recipient_id": ObjectId(user_id),
            "is_read": False
        }
        if notification_type:
            query["type"] = notification_type

        update_result = await self.collection.update_many(
            query,
            {
                "$set": {
                    "is_read": True,
                    "read_at": datetime.utcnow()
                }
            }
        )

        return update_result.modified_count

    async def delete_old_notifications(
        self,
        days: int = 30,
        exclude_unread: bool = True
    ) -> int:
        """Delete old notifications that are archived or read."""
        cutoff_date = datetime.utcnow() - datetime.timedelta(days=days)
        
        query = {
            "created_at": {"$lt": cutoff_date},
            "is_archived": True
        }
        if exclude_unread:
            query["is_read"] = True

        result = await self.collection.delete_many(query)
        return result.deleted_count

    async def get_user_preferences(
        self,
        user_id: str
    ) -> Optional[dict]:
        """Get notification preferences for a user."""
        if not ObjectId.is_valid(user_id):
            return None

        preferences = await self.preferences_collection.find_one(
            {"user_id": ObjectId(user_id)}
        )
        if preferences:
            preferences["id"] = str(preferences.pop("_id"))
            return preferences
        return None

    async def update_preferences(
        self,
        user_id: str,
        preferences: NotificationPreferences
    ) -> Optional[dict]:
        """Update notification preferences for a user."""
        if not ObjectId.is_valid(user_id):
            return None

        preferences_dict = preferences.dict()
        result = await self.preferences_collection.find_one_and_update(
            {"user_id": ObjectId(user_id)},
            {
                "$set": preferences_dict,
                "$setOnInsert": {"created_at": datetime.utcnow()}
            },
            upsert=True,
            return_document=True
        )

        if result:
            result["id"] = str(result.pop("_id"))
            return result
        return None

    async def get_stats(
        self,
        user_id: str,
        from_date: Optional[datetime] = None,
        to_date: Optional[datetime] = None
    ) -> NotificationStats:
        """Get notification statistics for a user."""
        match_stage = {"recipient_id": ObjectId(user_id)}
        if from_date or to_date:
            match_stage["created_at"] = {}
            if from_date:
                match_stage["created_at"]["$gte"] = from_date
            if to_date:
                match_stage["created_at"]["$lte"] = to_date

        pipeline = [
            {"$match": match_stage},
            {
                "$group": {
                    "_id": None,
                    "total_count": {"$sum": 1},
                    "unread_count": {
                        "$sum": {"$cond": [{"$eq": ["$is_read", False]}, 1, 0]}
                    },
                    "priority_counts": {
                        "$push": "$priority"
                    },
                    "type_counts": {
                        "$push": "$type"
                    }
                }
            }
        ]

        result = await self.collection.aggregate(pipeline).to_list(1)
        if not result:
            return NotificationStats()

        stats = result[0]
        
        # Calculate priority counts
        priority_counts = {"low": 0, "medium": 0, "high": 0, "critical": 0}
        for priority in stats["priority_counts"]:
            priority_counts[priority] = priority_counts.get(priority, 0) + 1

        # Calculate type counts
        type_counts = {
            "low_stock": 0,
            "order_status": 0,
            "price_change": 0,
            "expiry": 0,
            "system": 0
        }
        for type_ in stats["type_counts"]:
            type_counts[type_] = type_counts.get(type_, 0) + 1

        return NotificationStats(
            total_count=stats["total_count"],
            unread_count=stats["unread_count"],
            priority_counts=priority_counts,
            type_counts=type_counts
        )

    async def _get_reference_details(
        self,
        reference_type: str,
        reference_id: ObjectId
    ) -> Optional[dict]:
        """Get details of the referenced entity."""
        collection_map = {
            "product": "products",
            "purchase_order": "purchase_orders",
            "sales_order": "sales_orders",
            "inventory": "inventory_transactions",
            "system": None
        }

        if reference_type not in collection_map or not collection_map[reference_type]:
            return None

        collection = self.db.inven_pulse[collection_map[reference_type]]
        reference = await collection.find_one({"_id": reference_id})
        
        if reference:
            reference["id"] = str(reference.pop("_id"))
            return reference
        return None 