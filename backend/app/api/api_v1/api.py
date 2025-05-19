from fastapi import APIRouter
from app.api.v1.endpoints import (
    products,
    categories,
    suppliers,
    purchase_orders,
    sales_orders,
    inventory,
    notifications
)

api_router = APIRouter()

api_router.include_router(
    products.router,
    prefix="/products",
    tags=["products"]
)

api_router.include_router(
    categories.router,
    prefix="/categories",
    tags=["categories"]
)

api_router.include_router(
    suppliers.router,
    prefix="/suppliers",
    tags=["suppliers"]
)

api_router.include_router(
    purchase_orders.router,
    prefix="/purchase-orders",
    tags=["purchase-orders"]
)

api_router.include_router(
    sales_orders.router,
    prefix="/sales-orders",
    tags=["sales-orders"]
)

api_router.include_router(
    inventory.router,
    prefix="/inventory",
    tags=["inventory"]
)

api_router.include_router(
    notifications.router,
    prefix="/notifications",
    tags=["notifications"]
) 