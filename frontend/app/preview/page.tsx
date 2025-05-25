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

export default function PreviewPage() {
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'Your Store',
    productsSection: {
      heading: 'Our Products',
      columnsCount: 3,
      showPrices: true,
      showDescriptions: true,
    }
  });

  // In a real app, fetch settings and products from your API
  useEffect(() => {
    // Fetch store settings and products
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Store Header */}
      <StoreHeader storeName={storeSettings.storeName} />

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          {storeSettings.productsSection.heading}
        </h2>
        <div className={`grid grid-cols-1 gap-y-10 gap-x-6 
          ${storeSettings.productsSection.columnsCount === 2 ? 'sm:grid-cols-2' : 
            storeSettings.productsSection.columnsCount === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 
            'sm:grid-cols-2 lg:grid-cols-4'}`}
        >
          {/* Products will be dynamically loaded here */}
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