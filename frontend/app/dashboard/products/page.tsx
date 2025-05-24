'use client';

import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Filter, Download, Upload, MoreVertical } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image: string;
  description: string;
  lastUpdated: string;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Dummy data - replace with actual API call
  const categories: Category[] = [
    { id: 'all', name: 'All Products', count: 150 },
    { id: 'electronics', name: 'Electronics', count: 45 },
    { id: 'accessories', name: 'Accessories', count: 32 },
    { id: 'clothing', name: 'Clothing', count: 28 },
    { id: 'home', name: 'Home & Living', count: 25 },
    { id: 'books', name: 'Books', count: 20 },
  ];

  const products: Product[] = [
    {
      id: '1',
      name: 'Wireless Headphones',
      sku: 'WH-001',
      category: 'electronics',
      price: 99.99,
      stock: 45,
      status: 'In Stock',
      image: '/products/headphones.jpg',
      description: 'High-quality wireless headphones with noise cancellation',
      lastUpdated: '2024-03-15',
    },
    {
      id: '2',
      name: 'Smart Watch',
      sku: 'SW-002',
      category: 'electronics',
      price: 199.99,
      stock: 8,
      status: 'Low Stock',
      image: '/products/smartwatch.jpg',
      description: 'Feature-rich smartwatch with health tracking',
      lastUpdated: '2024-03-14',
    },
    {
      id: '3',
      name: 'Bluetooth Speaker',
      sku: 'BS-003',
      category: 'electronics',
      price: 79.99,
      stock: 0,
      status: 'Out of Stock',
      image: '/products/speaker.jpg',
      description: 'Portable Bluetooth speaker with great sound',
      lastUpdated: '2024-03-13',
    },
  ];

  const filteredProducts = products.filter(product =>
    (selectedCategory === 'all' || product.category === selectedCategory) &&
    (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a, b) => {
    const aValue = a[sortBy as keyof Product];
    const bValue = b[sortBy as keyof Product];
    return sortOrder === 'asc'
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedProducts(e.target.checked ? filteredProducts.map(p => p.id) : []);
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProducts(prev =>
      prev.includes(id)
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Products</h1>
        <div className="flex items-center gap-3">
          <button className="text-gray-600 dark:text-gray-300 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Upload size={20} />
          </button>
          <button className="text-gray-600 dark:text-gray-300 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Download size={20} />
          </button>
          <Link
            href="/dashboard/products/new"
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90"
          >
            <Plus size={20} />
            Add Product
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Categories</h2>
            <nav className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                    selectedCategory === category.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span>{category.name}</span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Products Table */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            {/* Search and Filters */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Filter size={20} />
                  Filters
                </button>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedProducts.length > 0 && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {selectedProducts.length} selected
                  </span>
                  <button className="text-sm text-red-600 hover:text-red-800">
                    Delete Selected
                  </button>
                  <button className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800">
                    Update Stock
                  </button>
                  <button className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800">
                    Change Category
                  </button>
                </div>
              </div>
            )}

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === filteredProducts.length}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('name')}
                        className="flex items-center gap-2"
                      >
                        Product
                        {sortBy === 'name' && (
                          <span className="text-primary">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('category')}
                        className="flex items-center gap-2"
                      >
                        Category
                        {sortBy === 'category' && (
                          <span className="text-primary">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('price')}
                        className="flex items-center gap-2"
                      >
                        Price
                        {sortBy === 'price' && (
                          <span className="text-primary">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('stock')}
                        className="flex items-center gap-2"
                      >
                        Stock
                        {sortBy === 'stock' && (
                          <span className="text-primary">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-10 w-10 rounded-lg object-cover mr-3"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              SKU: {product.sku}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {categories.find(c => c.id === product.category)?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          ${product.price.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {product.stock}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.status === 'In Stock'
                            ? 'bg-green-100 text-green-800'
                            : product.status === 'Low Stock'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/dashboard/products/${product.id}`}
                            className="text-primary hover:text-primary/80"
                          >
                            <Edit2 size={16} />
                          </Link>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 size={16} />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 