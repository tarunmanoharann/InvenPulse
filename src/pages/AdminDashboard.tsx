import React from 'react';
import { Route, Routes, Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Dashboard from '../components/admin/Dashboard';
import Inventory from '../components/admin/Inventory';
import Orders from '../components/admin/Orders';
import Users from '../components/admin/Users';
import Reports from '../components/admin/Reports';
import Settings from '../components/admin/Settings';
import { ThemeProvider } from "next-themes";

const AdminLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
};

export default AdminDashboard;