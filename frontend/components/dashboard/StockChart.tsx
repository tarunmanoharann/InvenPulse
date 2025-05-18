'use client';

import { useEffect, useRef } from 'react';

// Mock data for the chart
const mockData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Incoming Stock',
      data: [65, 59, 80, 81, 56, 55],
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
    {
      label: 'Outgoing Stock',
      data: [28, 48, 40, 19, 86, 27],
      borderColor: '#EF4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
    },
  ],
};

export default function StockChart() {
  const chartContainer = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // This is a placeholder for a real chart library
    // In a real implementation, you would use Chart.js, Recharts, or another library
    if (chartContainer.current) {
      const context = document.createElement('canvas');
      context.width = chartContainer.current.clientWidth;
      context.height = 300;
      
      // Add a fallback chart visualization
      const ctx = context.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
        ctx.fillRect(50, 50, 400, 200);
        ctx.strokeStyle = '#10B981';
        ctx.beginPath();
        ctx.moveTo(50, 200);
        ctx.lineTo(150, 150);
        ctx.lineTo(250, 180);
        ctx.lineTo(350, 100);
        ctx.lineTo(450, 120);
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
        ctx.fillRect(50, 100, 400, 150);
        ctx.strokeStyle = '#EF4444';
        ctx.beginPath();
        ctx.moveTo(50, 220);
        ctx.lineTo(150, 180);
        ctx.lineTo(250, 200);
        ctx.lineTo(350, 150);
        ctx.lineTo(450, 220);
        ctx.stroke();
        
        ctx.fillStyle = '#374151';
        ctx.font = '12px Arial';
        ctx.fillText('To display actual charts, install a charting library like Chart.js', 70, 30);
      }
      
      // Clear previous chart
      while (chartContainer.current.firstChild) {
        chartContainer.current.removeChild(chartContainer.current.firstChild);
      }
      
      // Append the canvas
      chartContainer.current.appendChild(context);
    }
  }, []);
  
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Incoming</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Outgoing</span>
          </div>
        </div>
        
        <select className="text-xs border-gray-300 dark:border-gray-600 rounded-md bg-transparent">
          <option>Last 6 months</option>
          <option>Last 3 months</option>
          <option>Last 30 days</option>
        </select>
      </div>
      
      <div ref={chartContainer} className="w-full h-[300px]"></div>
    </div>
  );
} 