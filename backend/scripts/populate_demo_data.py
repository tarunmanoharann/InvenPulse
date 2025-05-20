import asyncio
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from passlib.context import CryptContext

# MongoDB connection
MONGODB_URL = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGODB_URL)
db = client.inven_pulse

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_demo_users():
    users = [
        {
            "_id": ObjectId(),
            "email": "admin@invenpulse.com",
            "password": pwd_context.hash("admin123"),
            "full_name": "Admin User",
            "role": "admin",
            "is_active": True,
            "created_at": datetime.utcnow(),
        },
        {
            "_id": ObjectId(),
            "email": "manager@invenpulse.com",
            "password": pwd_context.hash("manager123"),
            "full_name": "Manager User",
            "role": "manager",
            "is_active": True,
            "created_at": datetime.utcnow(),
        },
        {
            "_id": ObjectId(),
            "email": "staff@invenpulse.com",
            "password": pwd_context.hash("staff123"),
            "full_name": "Staff User",
            "role": "staff",
            "is_active": True,
            "created_at": datetime.utcnow(),
        }
    ]
    await db.users.insert_many(users)
    return users

async def create_demo_categories():
    categories = [
        {
            "_id": ObjectId(),
            "name": "Electronics",
            "description": "Electronic devices and accessories",
        },
        {
            "_id": ObjectId(),
            "name": "Office Supplies",
            "description": "General office supplies and stationery",
        },
        {
            "_id": ObjectId(),
            "name": "Furniture",
            "description": "Office furniture and fixtures",
        }
    ]
    await db.categories.insert_many(categories)
    return categories

async def create_demo_suppliers():
    suppliers = [
        {
            "_id": ObjectId(),
            "name": "TechSupply Co",
            "contact_name": "John Smith",
            "email": "john@techsupply.com",
            "phone": "+1-555-0123",
            "address": "123 Tech Street, Silicon Valley, CA",
        },
        {
            "_id": ObjectId(),
            "name": "Office Essentials",
            "contact_name": "Mary Johnson",
            "email": "mary@officeessentials.com",
            "phone": "+1-555-0124",
            "address": "456 Office Road, Business District, NY",
        },
        {
            "_id": ObjectId(),
            "name": "Furniture Plus",
            "contact_name": "Robert Brown",
            "email": "robert@furnitureplus.com",
            "phone": "+1-555-0125",
            "address": "789 Furniture Ave, Industrial Park, TX",
        }
    ]
    await db.suppliers.insert_many(suppliers)
    return suppliers

async def create_demo_products(categories, suppliers):
    products = []
    
    # Electronics
    products.extend([
        {
            "_id": ObjectId(),
            "name": "Laptop Pro X1",
            "sku": "LPRO-X1",
            "description": "High-performance laptop for professionals",
            "category_id": categories[0]["_id"],
            "unit_price": 1299.99,
            "stock_quantity": 50,
            "reorder_point": 10,
            "supplier_id": suppliers[0]["_id"],
            "status": "active",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        },
        {
            "_id": ObjectId(),
            "name": "Wireless Mouse M1",
            "sku": "WM-M1",
            "description": "Ergonomic wireless mouse",
            "category_id": categories[0]["_id"],
            "unit_price": 29.99,
            "stock_quantity": 200,
            "reorder_point": 50,
            "supplier_id": suppliers[0]["_id"],
            "status": "active",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
    ])

    # Office Supplies
    products.extend([
        {
            "_id": ObjectId(),
            "name": "Premium Paper A4",
            "sku": "PP-A4",
            "description": "High-quality A4 printing paper",
            "category_id": categories[1]["_id"],
            "unit_price": 9.99,
            "stock_quantity": 1000,
            "reorder_point": 200,
            "supplier_id": suppliers[1]["_id"],
            "status": "active",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        },
        {
            "_id": ObjectId(),
            "name": "Ballpoint Pen Set",
            "sku": "BPS-12",
            "description": "12-pack premium ballpoint pens",
            "category_id": categories[1]["_id"],
            "unit_price": 12.99,
            "stock_quantity": 150,
            "reorder_point": 30,
            "supplier_id": suppliers[1]["_id"],
            "status": "active",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
    ])

    # Furniture
    products.extend([
        {
            "_id": ObjectId(),
            "name": "Executive Chair",
            "sku": "EC-100",
            "description": "Premium ergonomic office chair",
            "category_id": categories[2]["_id"],
            "unit_price": 299.99,
            "stock_quantity": 20,
            "reorder_point": 5,
            "supplier_id": suppliers[2]["_id"],
            "status": "active",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        },
        {
            "_id": ObjectId(),
            "name": "Standing Desk",
            "sku": "SD-200",
            "description": "Adjustable height standing desk",
            "category_id": categories[2]["_id"],
            "unit_price": 499.99,
            "stock_quantity": 15,
            "reorder_point": 3,
            "supplier_id": suppliers[2]["_id"],
            "status": "active",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
    ])

    await db.products.insert_many(products)
    return products

async def create_demo_notifications(users):
    notifications = []
    now = datetime.utcnow()

    for user in users:
        notifications.extend([
            {
                "_id": ObjectId(),
                "type": "low_stock",
                "priority": "high",
                "title": "Low Stock Alert",
                "message": "Laptop Pro X1 is running low on stock",
                "recipient_id": user["_id"],
                "reference_type": "product",
                "is_read": False,
                "is_archived": False,
                "created_at": now - timedelta(days=1),
            },
            {
                "_id": ObjectId(),
                "type": "system",
                "priority": "medium",
                "title": "Welcome to InvenPulse",
                "message": "Welcome to InvenPulse! Get started by exploring your dashboard.",
                "recipient_id": user["_id"],
                "is_read": False,
                "is_archived": False,
                "created_at": now - timedelta(days=2),
            }
        ])

    await db.notifications.insert_many(notifications)
    return notifications

async def main():
    # Clear existing data
    collections = await db.list_collection_names()
    for collection in collections:
        await db[collection].delete_many({})

    # Create demo data
    users = await create_demo_users()
    categories = await create_demo_categories()
    suppliers = await create_demo_suppliers()
    products = await create_demo_products(categories, suppliers)
    notifications = await create_demo_notifications(users)

    print("Demo data created successfully!")
    print("\nDemo Account Credentials:")
    print("Admin - Email: admin@invenpulse.com, Password: admin123")
    print("Manager - Email: manager@invenpulse.com, Password: manager123")
    print("Staff - Email: staff@invenpulse.com, Password: staff123")

if __name__ == "__main__":
    asyncio.run(main()) 