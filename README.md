# InvenPulse - Intelligent Inventory Management 🚀

An advanced inventory management system providing Demand Forecasting, Sentiment Analysis, and Fraud Detection capabilities using Gradio API clients.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Configuration](#configuration)

## ✨ Features

### 1. Demand Forecasting
- Predict future demand based on historical data
- Optimize inventory levels automatically
- Make data-driven stocking decisions

### 2. Sentiment Analysis
- Analyze customer reviews and feedback
- Understand product sentiment trends
- Make informed product decisions

### 3. Fraud Detection
- Real-time transaction monitoring
- Automated fraud prevention
- Secure business operations

## 🛠️ Tech Stack

- **Frontend:**
  - React + Vite
  - TypeScript
  - TailwindCSS

- **Backend:**
  - SpringBoot

- **Design:**
  - Figma

## 📸 Screenshots

### Home Page
![HomePage Image](https://github.com/tarunmanoharann/InvenPulse/blob/main/photos/Home.png)

### User Dashboard
![UserDashboard Image](https://github.com/tarunmanoharann/InvenPulse/blob/main/photos/UserDashboard.png)

### Admin Dashboard
![AdminDashboard Image](https://github.com/tarunmanoharann/InvenPulse/blob/main/photos/AdminDashboard.png)

## 💻 Installation

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn
- Java JDK 17 or higher

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

2. Install Maven dependencies
```bash
./mvnw install
```

## 🚀 Getting Started

1. Start the frontend development server:
```bash
npm run dev
# or
yarn dev
```

2. Start the backend server:
```bash
./mvnw spring-boot:run
```

3. Open your browser and visit:
```
http://localhost:5173
```

## ⚙️ Configuration

### Environment Variables
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=your_backend_url
VITE_GRADIO_API_KEY=your_gradio_api_key
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

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
