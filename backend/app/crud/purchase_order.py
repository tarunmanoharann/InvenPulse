from typing import List, Optional, Dict
from datetime import datetime
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from app.models.purchase_order import (
    PurchaseOrderCreate,
    PurchaseOrderUpdate,
    PurchaseOrder,
    PurchaseOrderWithDetails,
    PurchaseOrderItem,
    PurchaseOrderItemCreate,
    PurchaseOrderItemUpdate
)

class PurchaseOrderCRUD:
    def __init__(self, db: AsyncIOMotorClient):
        self.db = db
        self.collection = db.invenpulse.purchase_orders
        self.items_collection = db.invenpulse.purchase_order_items

    async def create(self, order: PurchaseOrderCreate, created_by: str) -> PurchaseOrder:
        # Create the order
        order_dict = order.model_dump(exclude={"items"})
        order_dict["created_by"] = ObjectId(created_by)
        order_dict["created_at"] = datetime.utcnow()
        order_dict["updated_at"] = datetime.utcnow()
        
        result = await self.collection.insert_one(order_dict)
        order_id = result.inserted_id

        # Create order items
        items = []
        for item in order.items:
            item_dict = item.model_dump()
            item_dict["purchase_order_id"] = order_id
            item_dict["created_at"] = datetime.utcnow()
            item_dict["updated_at"] = datetime.utcnow()
            items.append(item_dict)

        if items:
            await self.items_collection.insert_many(items)

        # Get the complete order with items
        return await self.get(str(order_id))

    async def get(self, id: str) -> Optional[PurchaseOrder]:
        if not ObjectId.is_valid(id):
            return None

        order = await self.collection.find_one({"_id": ObjectId(id)})
        if not order:
            return None

        # Get order items
        items_cursor = self.items_collection.find({"purchase_order_id": ObjectId(id)})
        items = await items_cursor.to_list(length=None)
        order["items"] = [PurchaseOrderItem(**item) for item in items]

        return PurchaseOrder(**order)

    async def get_with_details(self, id: str) -> Optional[PurchaseOrderWithDetails]:
        if not ObjectId.is_valid(id):
            return None

        pipeline = [
            {"$match": {"_id": ObjectId(id)}},
            {
                "$lookup": {
                    "from": "suppliers",
                    "localField": "supplier_id",
                    "foreignField": "_id",
                    "as": "supplier"
                }
            },
            {
                "$lookup": {
                    "from": "purchase_order_items",
                    "localField": "_id",
                    "foreignField": "purchase_order_id",
                    "as": "items"
                }
            },
            {
                "$addFields": {
                    "supplier_name": {"$arrayElemAt": ["$supplier.name", 0]},
                    "items_count": {"$size": "$items"},
                    "received_items_count": {
                        "$size": {
                            "$filter": {
                                "input": "$items",
                                "as": "item",
                                "cond": {"$eq": ["$$item.status", "received"]}
                            }
                        }
                    }
                }
            },
            {
                "$project": {
                    "supplier": 0
                }
            }
        ]

        result = await self.collection.aggregate(pipeline).to_list(length=1)
        if result:
            return PurchaseOrderWithDetails(**result[0])
        return None

    async def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        status: Optional[str] = None,
        supplier_id: Optional[str] = None,
        from_date: Optional[datetime] = None,
        to_date: Optional[datetime] = None
    ) -> List[PurchaseOrder]:
        query = {}
        if status:
            query["status"] = status
        if supplier_id and ObjectId.is_valid(supplier_id):
            query["supplier_id"] = ObjectId(supplier_id)
        if from_date:
            query["order_date"] = {"$gte": from_date}
        if to_date:
            query["order_date"] = query.get("order_date", {})
            query["order_date"]["$lte"] = to_date

        cursor = self.collection.find(query).skip(skip).limit(limit)
        orders = await cursor.to_list(length=limit)

        # Get items for all orders
        order_ids = [order["_id"] for order in orders]
        items_cursor = self.items_collection.find({"purchase_order_id": {"$in": order_ids}})
        items = await items_cursor.to_list(length=None)

        # Group items by order_id
        items_by_order = {}
        for item in items:
            order_id = str(item["purchase_order_id"])
            if order_id not in items_by_order:
                items_by_order[order_id] = []
            items_by_order[order_id].append(PurchaseOrderItem(**item))

        # Add items to orders
        for order in orders:
            order["items"] = items_by_order.get(str(order["_id"]), [])

        return [PurchaseOrder(**order) for order in orders]

    async def update(
        self,
        id: str,
        order: PurchaseOrderUpdate
    ) -> Optional[PurchaseOrder]:
        if not ObjectId.is_valid(id):
            return None

        update_data = order.model_dump(exclude_unset=True)
        if update_data:
            update_data["updated_at"] = datetime.utcnow()
            await self.collection.update_one(
                {"_id": ObjectId(id)},
                {"$set": update_data}
            )

        return await self.get(id)

    async def update_item(
        self,
        order_id: str,
        item_id: str,
        item: PurchaseOrderItemUpdate
    ) -> Optional[PurchaseOrderItem]:
        if not ObjectId.is_valid(order_id) or not ObjectId.is_valid(item_id):
            return None

        update_data = item.model_dump(exclude_unset=True)
        if update_data:
            update_data["updated_at"] = datetime.utcnow()
            result = await self.items_collection.update_one(
                {
                    "_id": ObjectId(item_id),
                    "purchase_order_id": ObjectId(order_id)
                },
                {"$set": update_data}
            )
            if result.modified_count:
                item = await self.items_collection.find_one({"_id": ObjectId(item_id)})
                if item:
                    return PurchaseOrderItem(**item)
        return None

    async def delete(self, id: str) -> bool:
        if not ObjectId.is_valid(id):
            return False

        # Delete order items first
        await self.items_collection.delete_many({"purchase_order_id": ObjectId(id)})
        
        # Delete the order
        result = await self.collection.delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0

    async def get_stats(
        self,
        supplier_id: Optional[str] = None,
        from_date: Optional[datetime] = None,
        to_date: Optional[datetime] = None
    ) -> Dict:
        match_stage = {}
        if supplier_id and ObjectId.is_valid(supplier_id):
            match_stage["supplier_id"] = ObjectId(supplier_id)
        if from_date:
            match_stage["order_date"] = {"$gte": from_date}
        if to_date:
            match_stage["order_date"] = match_stage.get("order_date", {})
            match_stage["order_date"]["$lte"] = to_date

        pipeline = [
            {"$match": match_stage} if match_stage else {"$match": {}},
            {
                "$group": {
                    "_id": None,
                    "total_orders": {"$sum": 1},
                    "total_amount": {"$sum": "$total_amount"},
                    "avg_order_value": {"$avg": "$total_amount"},
                    "pending_orders": {
                        "$sum": {"$cond": [{"$eq": ["$status", "pending"]}, 1, 0]}
                    },
                    "completed_orders": {
                        "$sum": {"$cond": [{"$eq": ["$status", "received"]}, 1, 0]}
                    }
                }
            }
        ]

        result = await self.collection.aggregate(pipeline).to_list(length=1)
        if not result:
            return {
                "total_orders": 0,
                "total_amount": 0,
                "avg_order_value": 0,
                "pending_orders": 0,
                "completed_orders": 0
            }
        
        stats = result[0]
        stats.pop("_id")
        return stats 