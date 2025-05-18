import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar - hidden on mobile, shown on larger screens */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full">
        {/* Top Bar */}
        <Topbar />
        
        {/* Main Content Area */}
        <div className="flex-1 p-4 md:p-6 pt-6 ml-0 md:ml-64 transition-all duration-300">
          {children}
        </div>
      </div>
      
      <Toaster position="top-right" />
    </div>
  );
} 