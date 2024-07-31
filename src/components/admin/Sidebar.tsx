import React from 'react';
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  BarChart,
  Settings,
  LogOut
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  to: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, label, to }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Button
      className={`w-full justify-start ${isActive ? 'bg-accent' : ''}`}
      variant="ghost"
      onClick={() => navigate(to)}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </Button>
  );
};

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const links: SidebarLinkProps[] = [
    { icon: <Home size={20} />, label: 'Dashboard', to: '/admin-dashboard' },
    { icon: <Package size={20} />, label: 'Inventory', to: '/admin-dashboard/inventory' },
    { icon: <ShoppingCart size={20} />, label: 'Orders', to: '/admin-dashboard/orders' },
    { icon: <Users size={20} />, label: 'Users', to: '/admin-dashboard/users' },
    { icon: <BarChart size={20} />, label: 'Reports', to: '/admin-dashboard/reports' },
    { icon: <Settings size={20} />, label: 'Settings', to: '/admin-dashboard/settings' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login'); // Add this if you want to redirect after logout
  };

  return (
    <div className="w-64 bg-background h-[calc(100vh-4rem)] p-4 flex flex-col">
      <nav className="space-y-2 flex-1">
        {links.map((link) => (
          <SidebarLink key={link.label} {...link} />
        ))}
      </nav>
      <Button 
        variant="ghost" 
        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100"
        onClick={handleLogout}
      >
        <LogOut size={20} />
        <span className="ml-2">Logout</span>
      </Button>
    </div>
  );
};

export default Sidebar;