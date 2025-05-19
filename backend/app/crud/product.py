from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from app.models.product import ProductCreate, ProductUpdate, Product

class ProductCRUD:
    def __init__(self, db: AsyncIOMotorClient):
        self.db = db
        self.collection = db.invenpulse.products

    async def create(self, product: ProductCreate) -> Product:
        product_dict = product.model_dump()
        product_dict["created_at"] = datetime.utcnow()
        product_dict["updated_at"] = datetime.utcnow()
        
        result = await self.collection.insert_one(product_dict)
        created_product = await self.collection.find_one({"_id": result.inserted_id})
        return Product(**created_product)

    async def get(self, id: str) -> Optional[Product]:
        if not ObjectId.is_valid(id):
            return None
        product = await self.collection.find_one({"_id": ObjectId(id)})
        if product:
            return Product(**product)
        return None

    async def get_by_sku(self, sku: str) -> Optional[Product]:
        product = await self.collection.find_one({"sku": sku})
        if product:
            return Product(**product)
        return None

    async def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        status: Optional[str] = None,
        category_id: Optional[str] = None
    ) -> List[Product]:
        query = {}
        if status:
            query["status"] = status
        if category_id and ObjectId.is_valid(category_id):
            query["category_id"] = ObjectId(category_id)

        cursor = self.collection.find(query).skip(skip).limit(limit)
        products = await cursor.to_list(length=limit)
        return [Product(**product) for product in products]

    async def update(self, id: str, product: ProductUpdate) -> Optional[Product]:
        if not ObjectId.is_valid(id):
            return None

        update_data = product.model_dump(exclude_unset=True)
        if update_data:
            update_data["updated_at"] = datetime.utcnow()
            await self.collection.update_one(
                {"_id": ObjectId(id)},
                {"$set": update_data}
            )

        updated_product = await self.collection.find_one({"_id": ObjectId(id)})
        if updated_product:
            return Product(**updated_product)
        return None

    async def delete(self, id: str) -> bool:
        if not ObjectId.is_valid(id):
            return False
            
        result = await self.collection.delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0

    async def search(self, query: str, limit: int = 10) -> List[Product]:
        search_query = {
            "$or": [
                {"name": {"$regex": query, "$options": "i"}},
                {"sku": {"$regex": query, "$options": "i"}},
                {"description": {"$regex": query, "$options": "i"}}
            ]
        }
        cursor = self.collection.find(search_query).limit(limit)
        products = await cursor.to_list(length=limit)
        return [Product(**product) for product in products]

    async def update_stock(self, id: str, quantity_change: int) -> Optional[Product]:
        if not ObjectId.is_valid(id):
            return None

        update_result = await self.collection.update_one(
            {"_id": ObjectId(id)},
            {
                "$inc": {"quantity_in_stock": quantity_change},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )

        if update_result.modified_count:
            updated_product = await self.collection.find_one({"_id": ObjectId(id)})
            return Product(**updated_product)
        return None 