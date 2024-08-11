// MiniFooter.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const MiniFooter: React.FC = () => {
  return (
    <footer className="w-full py-4 mt-auto bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-6">
          <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            Terms of Use
          </Link>
          <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            Privacy Policy
          </Link>
          <Link to="/help" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            Help
          </Link>
        </div>
        <div className="mt-2 text-center text-xs text-gray-400 dark:text-gray-500">
          © {new Date().getFullYear()} InvenPulse. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default MiniFooter;