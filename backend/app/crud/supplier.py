from typing import List, Optional
from datetime import datetime, timedelta
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from app.models.supplier import SupplierCreate, SupplierUpdate, Supplier, SupplierWithStats

class SupplierCRUD:
    def __init__(self, db: AsyncIOMotorClient):
        self.db = db
        self.collection = db.invenpulse.suppliers

    async def create(self, supplier: SupplierCreate) -> Supplier:
        supplier_dict = supplier.model_dump()
        supplier_dict["created_at"] = datetime.utcnow()
        supplier_dict["updated_at"] = datetime.utcnow()
        
        result = await self.collection.insert_one(supplier_dict)
        created_supplier = await self.collection.find_one({"_id": result.inserted_id})
        return Supplier(**created_supplier)

    async def get(self, id: str) -> Optional[Supplier]:
        if not ObjectId.is_valid(id):
            return None
        supplier = await self.collection.find_one({"_id": ObjectId(id)})
        if supplier:
            return Supplier(**supplier)
        return None

    async def get_by_email(self, email: str) -> Optional[Supplier]:
        supplier = await self.collection.find_one({"email": email})
        if supplier:
            return Supplier(**supplier)
        return None

    async def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        status: Optional[str] = None
    ) -> List[Supplier]:
        query = {}
        if status:
            query["status"] = status

        cursor = self.collection.find(query).skip(skip).limit(limit)
        suppliers = await cursor.to_list(length=limit)
        return [Supplier(**supplier) for supplier in suppliers]

    async def update(self, id: str, supplier: SupplierUpdate) -> Optional[Supplier]:
        if not ObjectId.is_valid(id):
            return None

        update_data = supplier.model_dump(exclude_unset=True)
        if update_data:
            update_data["updated_at"] = datetime.utcnow()
            await self.collection.update_one(
                {"_id": ObjectId(id)},
                {"$set": update_data}
            )

        updated_supplier = await self.collection.find_one({"_id": ObjectId(id)})
        if updated_supplier:
            return Supplier(**updated_supplier)
        return None

    async def delete(self, id: str) -> bool:
        if not ObjectId.is_valid(id):
            return False
            
        result = await self.collection.delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0

    async def search(self, query: str, limit: int = 10) -> List[Supplier]:
        search_query = {
            "$or": [
                {"name": {"$regex": query, "$options": "i"}},
                {"contact_person": {"$regex": query, "$options": "i"}},
                {"email": {"$regex": query, "$options": "i"}}
            ]
        }
        cursor = self.collection.find(search_query).limit(limit)
        suppliers = await cursor.to_list(length=limit)
        return [Supplier(**supplier) for supplier in suppliers]

    async def get_with_stats(self, id: str) -> Optional[SupplierWithStats]:
        """Get supplier with performance metrics"""
        if not ObjectId.is_valid(id):
            return None

        pipeline = [
            {"$match": {"_id": ObjectId(id)}},
            {
                "$lookup": {
                    "from": "purchase_orders",
                    "localField": "_id",
                    "foreignField": "supplier_id",
                    "as": "orders"
                }
            },
            {
                "$addFields": {
                    "total_orders": {"$size": "$orders"},
                    "total_amount": {"$sum": "$orders.total_amount"},
                    "last_order_date": {"$max": "$orders.order_date"},
                    "average_delivery_time": {
                        "$avg": {
                            "$map": {
                                "input": "$orders",
                                "as": "order",
                                "in": {
                                    "$divide": [
                                        {"$subtract": ["$order.delivery_date", "$order.order_date"]},
                                        86400000  # Convert milliseconds to days
                                    ]
                                }
                            }
                        }
                    },
                    "on_time_delivery_rate": {
                        "$multiply": [
                            {
                                "$divide": [
                                    {
                                        "$size": {
                                            "$filter": {
                                                "input": "$orders",
                                                "as": "order",
                                                "cond": {
                                                    "$lte": ["$order.delivery_date", "$order.expected_delivery_date"]
                                                }
                                            }
                                        }
                                    },
                                    {"$size": "$orders"}
                                ]
                            },
                            100
                        ]
                    }
                }
            },
            {
                "$project": {
                    "orders": 0
                }
            }
        ]

        result = await self.collection.aggregate(pipeline).to_list(length=1)
        if result:
            return SupplierWithStats(**result[0])
        return None

    async def get_top_suppliers(self, limit: int = 5) -> List[SupplierWithStats]:
        """Get top suppliers based on order volume and delivery performance"""
        pipeline = [
            {
                "$lookup": {
                    "from": "purchase_orders",
                    "localField": "_id",
                    "foreignField": "supplier_id",
                    "as": "orders"
                }
            },
            {
                "$addFields": {
                    "total_orders": {"$size": "$orders"},
                    "total_amount": {"$sum": "$orders.total_amount"},
                    "last_order_date": {"$max": "$orders.order_date"}
                }
            },
            {
                "$match": {
                    "total_orders": {"$gt": 0}
                }
            },
            {
                "$sort": {
                    "total_amount": -1
                }
            },
            {
                "$limit": limit
            },
            {
                "$project": {
                    "orders": 0
                }
            }
        ]

        results = await self.collection.aggregate(pipeline).to_list(length=limit)
        return [SupplierWithStats(**result) for result in results] 