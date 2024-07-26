import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layouts'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="user-dashboard" element={<UserDashboard />} />
        <Route path="admin-dashboard" element={<AdminDashboard />} />
      </Route>
    </Routes>
  )
}

export default App