// user/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Search, ShoppingCart, BarChart, Bell, User, HelpCircle } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Inventory', icon: Package, path: '/inventory' },
    { name: 'Search Products', icon: Search, path: '/search' },
    { name: 'Orders', icon: ShoppingCart, path: '/orders' },
    { name: 'Reports', icon: BarChart, path: '/reports' },
    { name: 'Notifications', icon: Bell, path: '/notifications' },
    { name: 'Profile', icon: User, path: '/profile' },
    { name: 'Help & Support', icon: HelpCircle, path: '/help' },
  ];

  return (
    <aside className="w-64 bg-card text-card-foreground p-4 shadow-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">User Dashboard</h1>
      </div>
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg ${
                    isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;