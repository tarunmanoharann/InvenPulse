# InvenPulse Backend

The backend service for the InvenPulse Inventory Management System built with FastAPI and PostgreSQL.

## Features

- RESTful API with FastAPI
- PostgreSQL database with SQLAlchemy ORM
- JWT Authentication
- Role-based access control
- Database migrations with Alembic
- Input validation with Pydantic
- Comprehensive API documentation with Swagger/OpenAPI
- Async database operations
- Unit and integration tests

## Prerequisites

- Python 3.9+
- PostgreSQL 13+
- Virtual environment (recommended)

## Setup

1. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the root directory:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/invenpulse
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

4. Initialize the database:
```bash
alembic upgrade head
```

5. Run the development server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`
API documentation will be available at `http://localhost:8000/docs`

## Project Structure

```
backend/
├── alembic/              # Database migrations
├── app/
│   ├── api/             # API endpoints
│   ├── core/            # Core functionality (config, security)
│   ├── crud/            # Database operations
│   ├── db/              # Database configuration
│   ├── models/          # SQLAlchemy models
│   ├── schemas/         # Pydantic models
│   └── main.py         # FastAPI application
├── tests/               # Test files
├── .env                 # Environment variables
└── requirements.txt     # Project dependencies
```

## API Endpoints

The API provides the following endpoints:

- `/api/auth`: Authentication endpoints
- `/api/users`: User management
- `/api/products`: Product management
- `/api/categories`: Category management
- `/api/suppliers`: Supplier management
- `/api/purchase-orders`: Purchase order management
- `/api/sales-orders`: Sales order management
- `/api/inventory`: Inventory management
- `/api/notifications`: Notification management

## Testing

Run tests with pytest:
```bash
pytest
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Write/update tests
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 