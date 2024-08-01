import React from 'react';
import {
  LayoutDashboard,
  Package,
  Search,
  ShoppingCart,
  BarChart,
  Bell,
  User,
  HelpCircle,
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
    { icon: LayoutDashboard, label: 'Dashboard', to: '/user-dashboard' },
    { icon: Package, label: 'Inventory', to: '/user-dashboard/inventory' },
    { icon: Search, label: 'Search Products', to: '/user-dashboard/search' },
    { icon: ShoppingCart, label: 'Orders', to: '/user-dashboard/orders' },
    { icon: BarChart, label: 'Reports', to: '/user-dashboard/reports' },
    { icon: Bell, label: 'Notifications', to: '/user-dashboard/notifications' },
    { icon: User, label: 'Profile', to: '/user-dashboard/profile' },
    { icon: HelpCircle, label: 'Help & Support', to: '/user-dashboard/help' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="w-64 bg-background text-foreground p-4 shadow-lg top-0 h-screen flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">User Dashboard</h1>
      </div>
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