'use client';

import { useState } from 'react';
import { Plus, Search, TrendingUp, Package, ArrowUpRight } from 'lucide-react';

interface OutgoingStock {
  id: string;
  productName: string;
  customer: string;
  quantity: number;
  orderDate: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
}

export default function OutgoingStockPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy data - replace with actual API call
  const outgoingStocks: OutgoingStock[] = [
    { id: '1', productName: 'Wireless Headphones', customer: 'Tech Store Inc', quantity: 20, orderDate: '2024-03-15', status: 'Processing' },
    { id: '2', productName: 'Smart Watch', customer: 'Gadget World', quantity: 15, orderDate: '2024-03-14', status: 'Shipped' },
    { id: '3', productName: 'Bluetooth Speaker', customer: 'Audio Shop', quantity: 30, orderDate: '2024-03-13', status: 'Delivered' },
    { id: '4', productName: 'USB-C Cable', customer: 'Electronics Hub', quantity: 50, orderDate: '2024-03-12', status: 'Processing' },
  ];

  const filteredStocks = outgoingStocks.filter(stock =>
    stock.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Outgoing Stock</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90">
          <Plus size={20} />
          Add Outgoing Stock
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search outgoing stock..."
            className="pl-10 pr-4 py-2 w-full md:w-80 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Processing Orders</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">18</h3>
            </div>
            <Package className="text-primary" size={24} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Shipped Today</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">7</h3>
            </div>
            <ArrowUpRight className="text-primary" size={24} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Shipments</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">156</h3>
            </div>
            <TrendingUp className="text-primary" size={24} />
          </div>
        </div>
      </div>

      {/* Outgoing Stock Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredStocks.map((stock) => (
              <tr key={stock.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{stock.productName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-300">{stock.customer}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{stock.quantity}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{stock.orderDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(stock.status)}`}>
                    {stock.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 