// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function MiniNavbar  ()  {
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
          </div>
        </div>
      </div>
    </nav>
  );
};
