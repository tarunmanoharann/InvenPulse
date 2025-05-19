from typing import List, Optional, Dict, Tuple
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from app.models.inventory_transaction import (
    InventoryTransactionCreate,
    InventoryTransactionUpdate,
    InventoryAdjustment,
    InventoryTransfer,
    InventoryCount
)

class InventoryTransactionCRUD:
    def __init__(self, db: AsyncIOMotorClient):
        self.db = db
        self.collection = db.inven_pulse.inventory_transactions
        self.balances_collection = db.inven_pulse.inventory_balances

    async def create(
        self,
        transaction: InventoryTransactionCreate,
        user_id: str
    ) -> dict:
        # Start a session for transaction atomicity
        async with await self.db.start_session() as session:
            async with session.start_transaction():
                # Get current balance
                balance = await self.balances_collection.find_one(
                    {
                        "product_id": transaction.product_id,
                        "location_id": transaction.location_id
                    },
                    session=session
                )

                current_balance = balance["quantity"] if balance else 0
                new_balance = current_balance + transaction.quantity

                # Create transaction document
                transaction_dict = transaction.dict()
                transaction_dict["created_by"] = ObjectId(user_id)
                transaction_dict["created_at"] = datetime.utcnow()
                transaction_dict["updated_at"] = transaction_dict["created_at"]
                transaction_dict["running_balance"] = new_balance
                transaction_dict["value"] = (
                    transaction.quantity * transaction.unit_cost
                    if transaction.unit_cost
                    else 0
                )

                # Insert transaction
                result = await self.collection.insert_one(
                    transaction_dict,
                    session=session
                )

                # Update or create balance
                if balance:
                    await self.balances_collection.update_one(
                        {
                            "product_id": transaction.product_id,
                            "location_id": transaction.location_id
                        },
                        {
                            "$set": {
                                "quantity": new_balance,
                                "last_transaction_date": transaction_dict["created_at"]
                            },
                            "$inc": {"value": transaction_dict["value"]}
                        },
                        session=session
                    )
                else:
                    await self.balances_collection.insert_one(
                        {
                            "product_id": transaction.product_id,
                            "location_id": transaction.location_id,
                            "quantity": new_balance,
                            "value": transaction_dict["value"],
                            "last_transaction_date": transaction_dict["created_at"]
                        },
                        session=session
                    )

                transaction_dict["id"] = str(result.inserted_id)
                return transaction_dict

    async def get(self, transaction_id: str) -> Optional[dict]:
        if not ObjectId.is_valid(transaction_id):
            return None

        transaction = await self.collection.find_one(
            {"_id": ObjectId(transaction_id)}
        )
        if transaction:
            transaction["id"] = str(transaction.pop("_id"))
            return transaction
        return None

    async def get_with_details(self, transaction_id: str) -> Optional[dict]:
        if not ObjectId.is_valid(transaction_id):
            return None

        pipeline = [
            {"$match": {"_id": ObjectId(transaction_id)}},
            {
                "$lookup": {
                    "from": "products",
                    "localField": "product_id",
                    "foreignField": "_id",
                    "as": "product_details"
                }
            },
            {"$unwind": "$product_details"},
            {
                "$lookup": {
                    "from": "locations",
                    "localField": "location_id",
                    "foreignField": "_id",
                    "as": "location_details"
                }
            },
            {"$unwind": "$location_details"}
        ]

        # Add to_location lookup for transfers
        pipeline.extend([
            {
                "$lookup": {
                    "from": "locations",
                    "localField": "to_location_id",
                    "foreignField": "_id",
                    "as": "to_location_details"
                }
            },
            {
                "$unwind": {
                    "path": "$to_location_details",
                    "preserveNullAndEmptyArrays": True
                }
            }
        ])

        result = await self.collection.aggregate(pipeline).to_list(1)
        if result:
            transaction = result[0]
            transaction["id"] = str(transaction.pop("_id"))
            return transaction
        return None

    async def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        product_id: Optional[str] = None,
        location_id: Optional[str] = None,
        transaction_type: Optional[str] = None,
        from_date: Optional[datetime] = None,
        to_date: Optional[datetime] = None
    ) -> List[dict]:
        query = {}
        if product_id and ObjectId.is_valid(product_id):
            query["product_id"] = ObjectId(product_id)
        if location_id and ObjectId.is_valid(location_id):
            query["location_id"] = ObjectId(location_id)
        if transaction_type:
            query["transaction_type"] = transaction_type
        if from_date or to_date:
            query["created_at"] = {}
            if from_date:
                query["created_at"]["$gte"] = from_date
            if to_date:
                query["created_at"]["$lte"] = to_date

        cursor = self.collection.find(query).sort(
            "created_at", -1
        ).skip(skip).limit(limit)
        
        transactions = await cursor.to_list(length=limit)
        for transaction in transactions:
            transaction["id"] = str(transaction.pop("_id"))
        return transactions

    async def get_balance(
        self,
        product_id: str,
        location_id: str
    ) -> Optional[dict]:
        if not ObjectId.is_valid(product_id) or not ObjectId.is_valid(location_id):
            return None

        balance = await self.balances_collection.find_one({
            "product_id": ObjectId(product_id),
            "location_id": ObjectId(location_id)
        })
        if balance:
            balance["id"] = str(balance.pop("_id"))
            return balance
        return None

    async def process_adjustment(
        self,
        adjustment: InventoryAdjustment,
        user_id: str
    ) -> Tuple[dict, dict]:
        difference = adjustment.actual_quantity - adjustment.system_quantity
        if difference == 0:
            return None, None

        transaction = InventoryTransactionCreate(
            product_id=adjustment.product_id,
            quantity=difference,
            transaction_type="adjustment",
            reference_type="adjustment",
            location_id=adjustment.location_id,
            reason=adjustment.adjustment_reason,
            notes=adjustment.notes
        )

        transaction_result = await self.create(transaction, user_id)
        balance = await self.get_balance(
            str(adjustment.product_id),
            str(adjustment.location_id)
        )
        
        return transaction_result, balance

    async def process_transfer(
        self,
        transfer: InventoryTransfer,
        user_id: str
    ) -> Tuple[dict, dict]:
        async with await self.db.start_session() as session:
            async with session.start_transaction():
                # Deduct from source location
                from_transaction = InventoryTransactionCreate(
                    product_id=transfer.product_id,
                    quantity=-transfer.quantity,
                    transaction_type="transfer",
                    reference_type="transfer",
                    location_id=transfer.from_location_id,
                    to_location_id=transfer.to_location_id,
                    reason=transfer.reason,
                    notes=transfer.notes
                )
                from_result = await self.create(from_transaction, user_id)

                # Add to destination location
                to_transaction = InventoryTransactionCreate(
                    product_id=transfer.product_id,
                    quantity=transfer.quantity,
                    transaction_type="transfer",
                    reference_type="transfer",
                    location_id=transfer.to_location_id,
                    reason=transfer.reason,
                    notes=transfer.notes
                )
                to_result = await self.create(to_transaction, user_id)

                return from_result, to_result

    async def process_count(
        self,
        count: InventoryCount,
        user_id: str
    ) -> List[dict]:
        transactions = []
        async with await self.db.start_session() as session:
            async with session.start_transaction():
                for product in count.products:
                    difference = product["counted_quantity"] - product["system_quantity"]
                    if difference != 0:
                        transaction = InventoryTransactionCreate(
                            product_id=product["product_id"],
                            quantity=difference,
                            transaction_type="count",
                            reference_type="count",
                            location_id=count.location_id,
                            notes=count.notes
                        )
                        result = await self.create(transaction, user_id)
                        transactions.append(result)

                # Update last count date
                await self.balances_collection.update_many(
                    {"location_id": count.location_id},
                    {"$set": {"last_count_date": datetime.utcnow()}},
                    session=session
                )

        return transactions

    async def get_product_movements(
        self,
        product_id: str,
        from_date: Optional[datetime] = None,
        to_date: Optional[datetime] = None
    ) -> List[dict]:
        if not ObjectId.is_valid(product_id):
            return []

        query = {"product_id": ObjectId(product_id)}
        if from_date or to_date:
            query["created_at"] = {}
            if from_date:
                query["created_at"]["$gte"] = from_date
            if to_date:
                query["created_at"]["$lte"] = to_date

        cursor = self.collection.find(query).sort("created_at", 1)
        movements = await cursor.to_list(length=None)
        for movement in movements:
            movement["id"] = str(movement.pop("_id"))
        return movements

    async def get_location_movements(
        self,
        location_id: str,
        from_date: Optional[datetime] = None,
        to_date: Optional[datetime] = None
    ) -> List[dict]:
        if not ObjectId.is_valid(location_id):
            return []

        query = {
            "$or": [
                {"location_id": ObjectId(location_id)},
                {"to_location_id": ObjectId(location_id)}
            ]
        }
        if from_date or to_date:
            query["created_at"] = {}
            if from_date:
                query["created_at"]["$gte"] = from_date
            if to_date:
                query["created_at"]["$lte"] = to_date

        cursor = self.collection.find(query).sort("created_at", 1)
        movements = await cursor.to_list(length=None)
        for movement in movements:
            movement["id"] = str(movement.pop("_id"))
        return movements 