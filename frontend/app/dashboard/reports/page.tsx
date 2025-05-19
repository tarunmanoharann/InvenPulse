'use client';

import { useState } from 'react';
import { FileText, Download, BarChart2, PieChart, TrendingUp, Calendar } from 'lucide-react';

interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: any;
  lastGenerated: string;
}

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const reportTypes: ReportType[] = [
    {
      id: '1',
      name: 'Inventory Summary',
      description: 'Complete overview of current stock levels, low stock alerts, and inventory value',
      icon: BarChart2,
      lastGenerated: '2024-03-15',
    },
    {
      id: '2',
      name: 'Stock Movement',
      description: 'Detailed analysis of incoming and outgoing stock movements',
      icon: TrendingUp,
      lastGenerated: '2024-03-14',
    },
    {
      id: '3',
      name: 'Supplier Performance',
      description: 'Evaluation of supplier reliability, delivery times, and order accuracy',
      icon: PieChart,
      lastGenerated: '2024-03-13',
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Reports</h1>
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Reports Generated</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">156</h3>
            </div>
            <FileText className="text-primary" size={24} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Reports This Month</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">24</h3>
            </div>
            <Calendar className="text-primary" size={24} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Scheduled Reports</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">8</h3>
            </div>
            <Calendar className="text-primary" size={24} />
          </div>
        </div>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report) => (
          <div key={report.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <report.icon className="text-primary mr-3" size={24} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{report.name}</h3>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{report.description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Last Generated: {report.lastGenerated}
              </span>
              <button className="flex items-center text-primary hover:text-primary/80">
                <Download size={16} className="mr-1" />
                <span className="text-sm">Generate</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Scheduled Reports Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Scheduled Reports</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Report Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Frequency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Next Run</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Recipients</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Weekly Inventory Summary</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">Weekly</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">2024-03-18</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">3 recipients</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Monthly Performance Report</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">Monthly</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">2024-04-01</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">5 recipients</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 