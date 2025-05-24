'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import { 
  Home, Package, TrendingUp, ArrowUpRight, ArrowDownRight,
  Users, FileText, Bell, Settings, LogOut, Menu, Globe, Layout
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', icon: Home, path: '/dashboard' },
  { name: 'Products', icon: Package, path: '/dashboard/products' },
  { name: 'Store Layout', icon: Layout, path: '/dashboard/store-layout' },
  { name: 'Suppliers', icon: Users, path: '/dashboard/suppliers' },
  { name: 'Reports', icon: FileText, path: '/dashboard/reports' },
  { name: 'Notifications', icon: Bell, path: '/dashboard/notifications' },
  { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [userName, setUserName] = useState('');
  
  // Close sidebar when route changes (mobile)
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Close sidebar when clicking outside (mobile)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      if (sidebar && !sidebar.contains(event.target as Node) && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileOpen]);
  
  // Get user info
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const { name } = JSON.parse(userInfo);
        setUserName(name);
      }
    }
  }, []);

  const handleLogout = () => {
    // Remove token from cookies
    Cookies.remove('userToken');
    
    // Remove user info from localStorage
    localStorage.removeItem('userInfo');
    
    // Show success message
    toast.success('Logged out successfully');
    
    // Redirect to home page
    router.push('/');
  };

  return (
    <>
      {/* Mobile Menu Button - Fixed at top left */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 md:hidden z-50 p-2 rounded-md bg-primary text-white shadow-md"
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 shadow-md transition-transform duration-300 ease-in-out transform ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b dark:border-gray-700">
            <span className="text-xl font-bold text-primary">InvenPulse</span>
          </div>
          
          {/* User Info */}
          {userName && (
            <div className="px-4 py-3 border-b dark:border-gray-700">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Welcome,</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{userName}</p>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.path}
                      className={`flex items-center p-2 text-base font-normal rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <item.icon className="w-5 h-5 transition duration-75" />
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center p-2 w-full text-base font-normal text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop Overlay for Mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-30 bg-gray-800 bg-opacity-50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
} 