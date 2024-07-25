import React from 'react'
import { Routes, Route } from 'react-router-dom'
// import AdminRoutes from './routes/AdminRoutes'
// import UserRoutes from './routes/UserRoutes'
import Login from './pages/Login'
import Register from './pages/Register'

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/admin/*" element={<AdminRoutes />} /> */}
        {/* <Route path="/*" element={<UserRoutes />} /> */}
      </Routes>
    </div>
  )
}

export default App