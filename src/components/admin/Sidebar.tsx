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
  icon: React.ElementType;
  label: string;
  to: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon: Icon, label, to }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Button
      className={`w-full justify-start ${
        isActive 
          ? 'bg-primary text-primary-foreground' 
          : 'hover:bg-primary/10 hover:text-primary'
      }`}
      variant={isActive ? "default" : "ghost"}
      onClick={() => navigate(to)}
    >
      <Icon size={20} />
      <span className="ml-2">{label}</span>
    </Button>
  );
};

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const links: SidebarLinkProps[] = [
    { icon: Home, label: 'Dashboard', to: '/admin-dashboard' },
    { icon: Package, label: 'Inventory', to: '/admin-dashboard/inventory' },
    { icon: ShoppingCart, label: 'Orders', to: '/admin-dashboard/orders' },
    { icon: Users, label: 'Users', to: '/admin-dashboard/users' },
    { icon: BarChart, label: 'Reports', to: '/admin-dashboard/reports' },
    { icon: Settings, label: 'Settings', to: '/admin-dashboard/settings' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="w-64 bg-background text-foreground p-4 shadow-lg top-0 h-screen flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>
      <nav className="space-y-2 flex-1">
        {links.map((link) => (
          <SidebarLink key={link.label} {...link} />
        ))}
      </nav>
      <Button 
        variant="ghost" 
        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100 "
        onClick={handleLogout}
      >
        <LogOut size={20} />
        <span className="ml-2">Logout</span>
      </Button>
    </div>
  );
};

export default Sidebar;