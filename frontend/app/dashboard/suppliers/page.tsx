'use client';

import { useState } from 'react';
import { Plus, Search, Phone, Mail, MapPin, Edit2, Trash2 } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  status: 'Active' | 'Inactive';
  lastOrder: string;
}

export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy data - replace with actual API call
  const suppliers: Supplier[] = [
    {
      id: '1',
      name: 'TechSupply Co',
      contact: 'John Smith',
      email: 'john@techsupply.com',
      phone: '+1 (555) 123-4567',
      address: '123 Tech Street, Silicon Valley, CA',
      status: 'Active',
      lastOrder: '2024-03-15',
    },
    {
      id: '2',
      name: 'ElectroVendor',
      contact: 'Sarah Johnson',
      email: 'sarah@electrovendor.com',
      phone: '+1 (555) 234-5678',
      address: '456 Electronics Ave, New York, NY',
      status: 'Active',
      lastOrder: '2024-03-14',
    },
    {
      id: '3',
      name: 'AudioTech Ltd',
      contact: 'Mike Wilson',
      email: 'mike@audiotech.com',
      phone: '+1 (555) 345-6789',
      address: '789 Sound Road, Nashville, TN',
      status: 'Inactive',
      lastOrder: '2024-02-28',
    },
  ];

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Suppliers</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90">
          <Plus size={20} />
          Add Supplier
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search suppliers..."
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Suppliers</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">24</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Suppliers</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">18</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">New This Month</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">3</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{supplier.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{supplier.contact}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                supplier.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {supplier.status}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Mail size={16} className="mr-2" />
                <a href={`mailto:${supplier.email}`} className="hover:text-primary">{supplier.email}</a>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Phone size={16} className="mr-2" />
                <a href={`tel:${supplier.phone}`} className="hover:text-primary">{supplier.phone}</a>
              </div>
              <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                <MapPin size={16} className="mr-2 mt-1" />
                <span>{supplier.address}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Last Order: {supplier.lastOrder}
                </span>
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                    <Edit2 size={16} />
                  </button>
                  <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 