from typing import List, Optional, Dict
from datetime import datetime
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from app.models.category import CategoryCreate, CategoryUpdate, Category

class CategoryCRUD:
    def __init__(self, db: AsyncIOMotorClient):
        self.db = db
        self.collection = db.invenpulse.categories

    async def create(self, category: CategoryCreate) -> Category:
        category_dict = category.model_dump()
        category_dict["created_at"] = datetime.utcnow()
        category_dict["updated_at"] = datetime.utcnow()
        
        result = await self.collection.insert_one(category_dict)
        created_category = await self.collection.find_one({"_id": result.inserted_id})
        return Category(**created_category)

    async def get(self, id: str) -> Optional[Category]:
        if not ObjectId.is_valid(id):
            return None
        category = await self.collection.find_one({"_id": ObjectId(id)})
        if category:
            return Category(**category)
        return None

    async def get_by_name(self, name: str) -> Optional[Category]:
        category = await self.collection.find_one({"name": name})
        if category:
            return Category(**category)
        return None

    async def get_all(self, skip: int = 0, limit: int = 100) -> List[Category]:
        cursor = self.collection.find().skip(skip).limit(limit)
        categories = await cursor.to_list(length=limit)
        return [Category(**category) for category in categories]

    async def get_tree(self) -> List[Category]:
        """Get categories in a hierarchical structure"""
        categories = await self.collection.find().to_list(length=None)
        return self._build_category_tree(categories)

    def _build_category_tree(self, categories: List[Dict]) -> List[Category]:
        """Helper method to build category tree"""
        category_dict = {str(cat["_id"]): Category(**cat) for cat in categories}
        root_categories = []

        for category in category_dict.values():
            if category.parent_id:
                parent = category_dict.get(str(category.parent_id))
                if parent:
                    parent.subcategories.append(category)
            else:
                root_categories.append(category)

        return root_categories

    async def update(self, id: str, category: CategoryUpdate) -> Optional[Category]:
        if not ObjectId.is_valid(id):
            return None

        # Check for circular reference
        if category.parent_id:
            if str(category.parent_id) == id:
                raise ValueError("Category cannot be its own parent")
            
            # Check if new parent is not a child of current category
            children = await self._get_all_children(id)
            if str(category.parent_id) in [str(child["_id"]) for child in children]:
                raise ValueError("Cannot set a child category as parent")

        update_data = category.model_dump(exclude_unset=True)
        if update_data:
            update_data["updated_at"] = datetime.utcnow()
            await self.collection.update_one(
                {"_id": ObjectId(id)},
                {"$set": update_data}
            )

        updated_category = await self.collection.find_one({"_id": ObjectId(id)})
        if updated_category:
            return Category(**updated_category)
        return None

    async def delete(self, id: str) -> bool:
        """Delete category and update children to reference parent's parent"""
        if not ObjectId.is_valid(id):
            return False

        # Get category to be deleted
        category = await self.collection.find_one({"_id": ObjectId(id)})
        if not category:
            return False

        # Update children to reference parent's parent
        await self.collection.update_many(
            {"parent_id": ObjectId(id)},
            {"$set": {"parent_id": category.get("parent_id")}}
        )

        # Delete the category
        result = await self.collection.delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0

    async def _get_all_children(self, category_id: str) -> List[Dict]:
        """Helper method to get all children of a category"""
        children = []
        async def get_children(parent_id):
            cursor = self.collection.find({"parent_id": ObjectId(parent_id)})
            async for child in cursor:
                children.append(child)
                await get_children(str(child["_id"]))
        
        await get_children(category_id)
        return children

    async def get_with_product_count(self) -> List[Category]:
        """Get categories with product count"""
        pipeline = [
            {
                "$lookup": {
                    "from": "products",
                    "localField": "_id",
                    "foreignField": "category_id",
                    "as": "products"
                }
            },
            {
                "$addFields": {
                    "product_count": {"$size": "$products"}
                }
            },
            {
                "$project": {
                    "products": 0
                }
            }
        ]
        
        categories = await self.collection.aggregate(pipeline).to_list(length=None)
        return [Category(**category) for category in categories] 