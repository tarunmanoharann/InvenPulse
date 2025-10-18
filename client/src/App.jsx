import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Suppliers from "./pages/Suppliers";
import StockMovements from "./pages/StockMovements";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      
        
        {/* Protected routes with DashboardLayout */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route 
            path="categories" 
            element={
              <ProtectedRoute requiredRoles={['ROLE_MANAGER', 'ROLE_ADMIN']}>
                <Categories />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="suppliers" 
            element={
              <ProtectedRoute requiredRoles={['ROLE_MANAGER', 'ROLE_ADMIN']}>
                <Suppliers />
              </ProtectedRoute>
            } 
          />
          <Route path="stock-movements" element={<StockMovements />} />
        </Route>
        
        {/* Catch all - redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
