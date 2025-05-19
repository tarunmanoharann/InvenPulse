from datetime import datetime
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from app.models.sales_order import SalesOrderCreate, SalesOrderUpdate, SalesOrderItemUpdate

class SalesOrderCRUD:
    def __init__(self, db: AsyncIOMotorClient):
        self.db = db
        self.collection = db.inven_pulse.sales_orders

    async def create(self, order: SalesOrderCreate, user_id: str) -> dict:
        order_dict = order.dict()
        order_dict["created_at"] = datetime.utcnow()
        order_dict["updated_at"] = order_dict["created_at"]
        order_dict["created_by"] = user_id
        order_dict["total_items"] = sum(item.quantity for item in order.items)
        order_dict["final_amount"] = (
            order.total_amount * (1 - order.discount / 100) + order.tax + order.shipping_cost
        )
        order_dict["status_history"] = [{
            "status": order.status,
            "timestamp": order_dict["created_at"],
            "user_id": user_id
        }]
        
        result = await self.collection.insert_one(order_dict)
        order_dict["id"] = str(result.inserted_id)
        return order_dict

    async def get(self, order_id: str) -> Optional[dict]:
        order = await self.collection.find_one({"_id": ObjectId(order_id)})
        if order:
            order["id"] = str(order.pop("_id"))
            return order
        return None

    async def get_with_details(self, order_id: str) -> Optional[dict]:
        pipeline = [
            {"$match": {"_id": ObjectId(order_id)}},
            {
                "$lookup": {
                    "from": "customers",
                    "localField": "customer_id",
                    "foreignField": "_id",
                    "as": "customer_details"
                }
            },
            {"$unwind": "$customer_details"},
            {
                "$lookup": {
                    "from": "products",
                    "localField": "items.product_id",
                    "foreignField": "_id",
                    "as": "products"
                }
            }
        ]
        
        result = await self.collection.aggregate(pipeline).to_list(1)
        if result:
            order = result[0]
            order["id"] = str(order.pop("_id"))
            
            # Match products with items
            products_map = {str(p["_id"]): p for p in order.pop("products", [])}
            order["items_details"] = []
            for item in order["items"]:
                product = products_map.get(item["product_id"], {})
                item_detail = {**item, "product": product}
                order["items_details"].append(item_detail)
            
            return order
        return None

    async def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        status: Optional[str] = None,
        customer_id: Optional[str] = None,
        from_date: Optional[datetime] = None,
        to_date: Optional[datetime] = None
    ) -> List[dict]:
        query = {}
        if status:
            query["status"] = status
        if customer_id:
            query["customer_id"] = customer_id
        if from_date or to_date:
            query["created_at"] = {}
            if from_date:
                query["created_at"]["$gte"] = from_date
            if to_date:
                query["created_at"]["$lte"] = to_date

        cursor = self.collection.find(query).skip(skip).limit(limit)
        orders = await cursor.to_list(length=limit)
        for order in orders:
            order["id"] = str(order.pop("_id"))
        return orders

    async def update(self, order_id: str, order: SalesOrderUpdate) -> Optional[dict]:
        update_data = order.dict(exclude_unset=True)
        if update_data:
            update_data["updated_at"] = datetime.utcnow()
            if "status" in update_data:
                status_history = {
                    "status": update_data["status"],
                    "timestamp": update_data["updated_at"]
                }
                update_data["$push"] = {"status_history": status_history}

            result = await self.collection.find_one_and_update(
                {"_id": ObjectId(order_id)},
                {"$set": update_data},
                return_document=True
            )
            if result:
                result["id"] = str(result.pop("_id"))
                return result
        return None

    async def update_item(
        self,
        order_id: str,
        item_id: str,
        item: SalesOrderItemUpdate
    ) -> Optional[dict]:
        update_data = item.dict(exclude_unset=True)
        if update_data:
            result = await self.collection.find_one_and_update(
                {
                    "_id": ObjectId(order_id),
                    "items.product_id": item_id
                },
                {
                    "$set": {
                        f"items.$.{key}": value
                        for key, value in update_data.items()
                    },
                    "$set": {"updated_at": datetime.utcnow()}
                },
                return_document=True
            )
            if result:
                result["id"] = str(result.pop("_id"))
                return result
        return None

    async def delete(self, order_id: str) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(order_id)})
        return result.deleted_count > 0

    async def get_stats(
        self,
        customer_id: Optional[str] = None,
        from_date: Optional[datetime] = None,
        to_date: Optional[datetime] = None
    ) -> dict:
        match_stage = {}
        if customer_id:
            match_stage["customer_id"] = customer_id
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
                    "total_orders": {"$sum": 1},
                    "total_revenue": {"$sum": "$final_amount"},
                    "total_items_sold": {"$sum": "$total_items"},
                    "average_order_value": {"$avg": "$final_amount"},
                    "status_counts": {
                        "$push": "$status"
                    }
                }
            }
        ]

        result = await self.collection.aggregate(pipeline).to_list(1)
        if not result:
            return {
                "total_orders": 0,
                "total_revenue": 0,
                "total_items_sold": 0,
                "average_order_value": 0,
                "status_breakdown": {}
            }

        stats = result[0]
        status_list = stats.pop("status_counts", [])
        status_breakdown = {}
        for status in status_list:
            status_breakdown[status] = status_breakdown.get(status, 0) + 1
        stats["status_breakdown"] = status_breakdown
        stats.pop("_id")
        
        return stats 