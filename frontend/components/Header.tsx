'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useTheme } from '@/contexts/ThemeContext';

const Header = () => {
  const pathname = usePathname();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`${isDarkMode ? 'dark:bg-gray-900' : 'bg-white'} shadow sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              <svg className="h-8 w-8 mr-2 inline" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  className="animate-stack-1" 
                  d="M2 17L12 22L22 17" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  className="animate-stack-2" 
                  d="M2 12L12 17L22 12" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  className="animate-stack-3" 
                  d="M12 2L2 7L12 12L22 7L12 2Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              InvenPulse
            </Link>
          </div>

          <button
            onClick={toggleTheme}
            className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-2 focus:outline-none transition-all duration-300 ease-in-out"
          >
            <div className="relative w-6 h-6">
              <IconSun
                size={24}
                className={`absolute top-0 left-0 transition-all duration-300 ease-in-out ${
                  isDarkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                }`}
              />
              <IconMoon
                size={24}
                className={`absolute top-0 left-0 transition-all duration-300 ease-in-out ${
                  isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
                }`}
              />
            </div>
          </button>

          <div className="hidden sm:flex sm:items-center sm:ml-6">
            <div className="flex space-x-4">
              <Link
                href="/login"
                className={`${isDarkMode ? 'dark:text-gray-300' : 'text-gray-500'} hover:text-primary px-3 py-2 rounded-md text-sm font-medium ${pathname === '/login' ? 'text-primary' : ''}`}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={`${isDarkMode ? 'dark:text-gray-300' : 'text-gray-500'} hover:text-primary px-3 py-2 rounded-md text-sm font-medium ${pathname === '/register' ? 'text-primary' : ''}`}
              >
                Register
              </Link>
            </div>
          </div>

          <div className="sm:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/login"
            className={`${isDarkMode ? 'dark:text-gray-300' : 'text-gray-500'} hover:text-primary block px-3 py-2 rounded-md text-base font-medium ${pathname === '/login' ? 'text-primary' : ''}`}
          >
            Login
          </Link>
          <Link
            href="/register"
            className={`${isDarkMode ? 'dark:text-gray-300' : 'text-gray-500'} hover:text-primary block px-3 py-2 rounded-md text-base font-medium ${pathname === '/register' ? 'text-primary' : ''}`}
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;