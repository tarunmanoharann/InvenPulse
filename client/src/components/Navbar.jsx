// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar  ()  {
  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-50 border-b border-gray-200">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">InvenPulse</span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-8">
              <button 
                onClick={() => scrollToSection('features')} 
                className="relative group"
              >
                <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent font-medium">
                  Features
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 transition-all group-hover:w-full"></span>
              </button>
            </div>
          </div>
          <div className="flex items-center">
            <Link
              to="/login"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-md"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
