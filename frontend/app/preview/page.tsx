'use client';

import { useState, useEffect } from 'react';
import StoreHeader from '@/components/store/StoreHeader';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

// Dummy products data
const dummyProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 99.99,
    image: '/products/headphones.jpg',
    description: 'High-quality wireless headphones with noise cancellation',
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 199.99,
    image: '/products/smartwatch.jpg',
    description: 'Feature-rich smartwatch with health tracking',
  },
  {
    id: '3',
    name: 'Bluetooth Speaker',
    price: 79.99,
    image: '/products/speaker.jpg',
    description: 'Portable Bluetooth speaker with great sound',
  },
  // Add more dummy products as needed
];

export default function PreviewPage() {
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'Your Store',
    heroSection: {
      heading: 'Welcome to Our Store',
      subheading: 'Discover our amazing products',
      backgroundImage: '/hero-bg.jpg',
    },
    productsSection: {
      heading: 'Our Products',
      columnsCount: 3,
      showPrices: true,
      showDescriptions: true,
    },
    colors: {
      primary: '#3B82F6',
      accent: '#1D4ED8',
    },
  });

  // In a real app, fetch settings from your API
  useEffect(() => {
    // Fetch store settings
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Store Header */}
      <StoreHeader storeName={storeSettings.storeName} />

      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white">
        <div className="absolute inset-0">
          <img
            src={storeSettings.heroSection.backgroundImage}
            alt="Hero background"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {storeSettings.heroSection.heading}
          </h1>
          <p className="mt-6 text-xl max-w-3xl">
            {storeSettings.heroSection.subheading}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div id="products" className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          {storeSettings.productsSection.heading}
        </h2>
        <div className={`grid grid-cols-1 gap-y-10 gap-x-6 
          ${storeSettings.productsSection.columnsCount === 2 ? 'sm:grid-cols-2' : 
            storeSettings.productsSection.columnsCount === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 
            'sm:grid-cols-2 lg:grid-cols-4'}`}
        >
          {dummyProducts.map((product) => (
            <div key={product.id} className="group relative">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover object-center group-hover:opacity-75"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {product.name}
                </h3>
                {storeSettings.productsSection.showDescriptions && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {product.description}
                  </p>
                )}
                {storeSettings.productsSection.showPrices && (
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    ${product.price}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2024 {storeSettings.storeName}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 