# InvenPulse Backend

The backend API for the InvenPulse inventory management system.

## Prerequisites

- Node.js (v14.x or later)
- MongoDB Atlas account 

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/InvenPulse.git
cd InvenPulse/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=mongodb+srv://mtarun13122004:<your_password>@cluster0.xymwyqz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

Replace `<your_password>` with your actual MongoDB Atlas password.

## Running the application

### Development mode

```bash
npm run dev
```

This will start the server with nodemon, which will automatically restart when changes are detected.

### Production mode

```bash
npm start
```

## API Endpoints

### Authentication

- **POST /api/users/register**: Register a new user
  - Body: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`
  - Returns: User object with JWT token

- **POST /api/users/login**: Login a user
  - Body: `{ "email": "john@example.com", "password": "password123" }`
  - Returns: User object with JWT token

- **GET /api/users/profile**: Get user profile (Protected route)
  - Headers: `Authorization: Bearer <token>`
  - Returns: User object without password

## Folder Structure

- `src/config`: Configuration files (database connection)
- `src/controllers`: Route controllers
- `src/models`: Mongoose models
- `src/middleware`: Express middleware (authentication)
- `src/routes`: Express routes

## Technologies Used

- Express.js - Web framework
- MongoDB - Database
- Mongoose - MongoDB object modeling
- JSON Web Tokens (JWT) - Authentication
- bcryptjs - Password hashing 