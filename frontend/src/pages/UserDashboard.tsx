// UserDashboard.tsx
import React from 'react';
import { Route, Routes, Outlet } from 'react-router-dom';
import Sidebar from '../components/user/Sidebar';
import Dashboard from '../components/user/Dashboard';
import InventoryList from '../components/user/InventoryList';
import SearchProducts from '../components/user/SearchProducts';
import Orders from '../components/user/Orders';
import Reports from '../components/user/Reports';
import Notifications from '../components/user/Notifications';
import UserProfile from '../components/user/UserProfile';
import HelpSupport from '../components/user/HelpSupport';


const UserLayout = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

const UserDashboard: React.FC = () => {
  return (
      <Routes>
        <Route element={<UserLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<InventoryList />} />
          <Route path="search" element={<SearchProducts />} />
          <Route path="orders" element={<Orders />} />
          <Route path="reports" element={<Reports />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="help" element={<HelpSupport />} />
        </Route>
      </Routes>
  );
};

export default UserDashboard;