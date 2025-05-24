'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  images: string[];
  variants: ProductVariant[];
  specifications: Record<string, string>;
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'variants' | 'images' | 'seo'>('basic');
  
  const [product, setProduct] = useState<Product>({
    id: params.id as string,
    name: 'Wireless Headphones',
    sku: 'WH-001',
    description: 'High-quality wireless headphones with noise cancellation',
    category: 'electronics',
    price: 99.99,
    stock: 45,
    status: 'active',
    images: ['/products/headphones-1.jpg', '/products/headphones-2.jpg'],
    variants: [
      {
        id: '1',
        sku: 'WH-001-BLK',
        name: 'Black',
        price: 99.99,
        stock: 30,
        attributes: { color: 'Black' },
      },
      {
        id: '2',
        sku: 'WH-001-WHT',
        name: 'White',
        price: 99.99,
        stock: 15,
        attributes: { color: 'White' },
      },
    ],
    specifications: {
      'Battery Life': '20 hours',
      'Connectivity': 'Bluetooth 5.0',
      'Weight': '250g',
    },
    seo: {
      title: 'Wireless Headphones - Your Store',
      description: 'High-quality wireless headphones with noise cancellation feature',
      keywords: 'wireless headphones, noise cancellation, bluetooth headphones',
    },
  });

  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSpecificationChange = (key: string, value: string) => {
    setProduct(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value,
      },
    }));
  };

  const handleSeoChange = (field: keyof Product['seo'], value: string) => {
    setProduct(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Implement save logic here
    setIsLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/products"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Edit Product</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-red-600 hover:text-red-800 px-4 py-2 rounded-lg border border-red-600 hover:bg-red-50">
            <Trash2 size={20} />
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50"
          >
            <Save size={20} />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'basic', label: 'Basic Info' },
            { id: 'variants', label: 'Variants' },
            { id: 'images', label: 'Images' },
            { id: 'seo', label: 'SEO' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Basic Info Tab */}
      {activeTab === 'basic' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleBasicInfoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                SKU
              </label>
              <input
                type="text"
                name="sku"
                value={product.sku}
                onChange={handleBasicInfoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleBasicInfoChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleBasicInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={product.stock}
                  onChange={handleBasicInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Specifications
              </h3>
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex items-center gap-4 mb-4">
                  <input
                    type="text"
                    value={key}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Specification name"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleSpecificationChange(key, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Value"
                  />
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button className="text-primary hover:text-primary/80 flex items-center gap-2">
                <Plus size={16} />
                Add Specification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Variants Tab */}
      {activeTab === 'variants' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Product Variants</h3>
            <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90">
              <Plus size={20} />
              Add Variant
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {product.variants.map((variant) => (
              <div
                key={variant.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Variant Name
                    </label>
                    <input
                      type="text"
                      value={variant.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={variant.sku}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      value={variant.price}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={variant.stock}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Images Tab */}
      {activeTab === 'images' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700"
              >
                <img
                  src={image}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-2 right-2 text-red-600 hover:text-red-800 bg-white rounded-full p-1">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button className="aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 hover:text-gray-600">
              <ImageIcon size={24} />
            </button>
          </div>
        </div>
      )}

      {/* SEO Tab */}
      {activeTab === 'seo' && (
        <div className="max-w-2xl space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              SEO Title
            </label>
            <input
              type="text"
              value={product.seo.title}
              onChange={(e) => handleSeoChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Meta Description
            </label>
            <textarea
              value={product.seo.description}
              onChange={(e) => handleSeoChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Keywords
            </label>
            <input
              type="text"
              value={product.seo.keywords}
              onChange={(e) => handleSeoChange('keywords', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Comma-separated keywords"
            />
          </div>
        </div>
      )}
    </div>
  );
} 