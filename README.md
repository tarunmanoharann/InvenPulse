# InvenPulse - Inventory Management System 🚀
A comprehensive inventory management system with modern UI/UX and robust features for efficient stock control and business operations.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Security](#security)
- [License](#license)
- [Contributors](#contributors)

## ✨ Features
- **Authentication & Authorization** with role-based access control
- **Interactive Dashboard** with analytics and insights
- **Products Management** with comprehensive CRUD operations
- **Categories Management** with hierarchical structure
- **Suppliers Management** with performance metrics
- **Reporting** with customizable exports

## 🛠️ Tech Stack
- **Frontend:**
  - React 18+ with Vite
  - Redux Toolkit for state management
  - Tailwind CSS for styling
  - shadcn/ui for UI components
  - React Router v6 for routing
  - React Hook Form with Zod validation
  - Recharts for data visualization
- **Backend:**
  - Spring Boot 3.x
  - MySQL 8.0+ database
  - Spring Data JPA for ORM
  - Spring Security with JWT
  - Swagger/OpenAPI for documentation
- **Security:**
  - JWT Authentication
  - Role-Based Access Control (RBAC)
  - Password encryption with BCrypt

## 🏗️ Project Structure

### Frontend Structure
```
client/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   └── Layout.jsx
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── categories/
│   │   ├── suppliers/
│   │   ├── reports/
│   │   └── common/
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Products.jsx
│   │   ├── Categories.jsx
│   │   ├── Suppliers.jsx
│   │   └── Reports.jsx
│   ├── store/
│   │   ├── store.js
│   │   └── slices/
│   ├── services/
│   ├── utils/
│   ├── hooks/
│   ├── App.jsx
│   └── main.jsx
```

### Backend Structure
```
invenpulse-backend/
├── src/main/java/com/invenpulse/
│   ├── config/
│   ├── controller/
│   ├── model/
│   ├── repository/
│   ├── service/
│   ├── dto/
│   ├── security/
│   ├── exception/
│   └── InvenpulseApplication.java
```

## 💻 Installation

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn
- Java 17 or higher
- MySQL 8.0+
- Maven or Gradle

### Frontend Setup
1. Clone the repository
```bash
git clone https://github.com/yourusername/InvenPulse.git
cd InvenPulse/client
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

### Backend Setup
1. Navigate to the backend directory
```bash
cd ../invenpulse-backend
```

2. Build the project
```bash
# If using Maven
mvn clean install

# If using Gradle
gradle build
```

3. Run the application
```bash
# If using Maven
mvn spring-boot:run

# If using Gradle
gradle bootRun
```

## 🚀 Getting Started
1. Start the backend server
2. Start the frontend development server
3. Access the application at `http://localhost:5173`
4. Login with default credentials:
   - Admin: admin@invenpulse.com / admin123
   - Manager: manager@invenpulse.com / manager123
   - User: user@invenpulse.com / user123

## 🔒 Security
- JWT-based authentication
- Role-based access control with three roles:
  - **ADMIN**: Full access to all features
  - **MANAGER**: Access to manage products, categories, and view reports
  - **USER**: Limited access to view products and basic operations

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors
- Your Name - Initial work

