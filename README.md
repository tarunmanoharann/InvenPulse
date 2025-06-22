# InvenPulse - Intelligent Inventory Management 🚀
An advanced inventory management system providing Demand Forecasting, Sentiment Analysis, and Fraud Detection capabilities using Gradio API clients.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Configuration](#configuration)

## 🛠️ Tech Stack
- **Frontend:**
  - NextJs
  - TypeScript
  - ShadeCN
  - TailwindCSS
- **Backend:**
  - Node.js/Express
  - MongoDB
  - Mongoose ODM
- **Database:**
  - MongoDB Atlas (Cloud) or Local MongoDB

## 💻 Installation

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn
- MongoDB (local installation) or MongoDB Atlas account

### Frontend Setup
1. Clone the repository
```bash
git clone https://github.com/yourusername/InvenPulse.git
cd InvenPulse/frontend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Install TailwindCSS and its dependencies
```bash
npm install -D tailwindcss postcss autoprefixer
# or
yarn add -D tailwindcss postcss autoprefixer
```

4. Initialize TailwindCSS
```bash
npx tailwindcss init -p
```

### Backend Setup
1. Navigate to the backend directory
```bash
cd ../backend
```

2. Install Node.js dependencies
```bash
npm install
# or
yarn install
```

3. Install required backend packages
```bash
npm install express mongoose cors dotenv helmet morgan
npm install -D nodemon
# or
yarn add express mongoose cors dotenv helmet morgan
yarn add -D nodemon
```

### Database Setup

#### Option 1: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Add your IP address to the whitelist

#### Option 2: Local MongoDB
1. Install MongoDB Community Edition from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
```bash
# Windows
net start MongoDB

# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

## 🚀 Getting Started

1. Start MongoDB (if using local installation):
```bash
mongod
```

2. Start the backend server:
```bash
cd backend
npm run dev
# or
yarn dev
```

3. Start the frontend development server:
```bash
cd frontend
npm run dev
# or
yarn dev
```

4. Open your browser and visit:
```
http://localhost:3000
```

## ⚙️ Configuration

### Environment Variables

#### Frontend (.env)
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GRADIO_API_KEY=your_gradio_api_key
```

#### Backend (.env)
Create a `.env` file in the backend directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
# For MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/invenpulse?retryWrites=true&w=majority

# For Local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/invenpulse

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# API Keys
GRADIO_API_KEY=your_gradio_api_key
```

### TailwindCSS Configuration
Ensure your `tailwind.config.js` includes:
```javascript
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Backend Package.json Scripts
Add these scripts to your backend `package.json`:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  }
}
```

## 📁 Project Structure
```
InvenPulse/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── controllers/
│   ├── config/
│   ├── server.js
│   ├── package.json
│   └── ...
└── README.md
```


## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

