'use client';

import { useState } from 'react';
import { Image, Save } from 'lucide-react';
import Link from 'next/link';

interface StoreSettings {
  storeName: string;
  heroSection: {
    heading: string;
    subheading: string;
    backgroundImage: string;
  };
  productsSection: {
    heading: string;
    columnsCount: number;
    showPrices: boolean;
    showDescriptions: boolean;
  };
  colors: {
    primary: string;
    accent: string;
  };
}

export default function StoreLayoutPage() {
  const [settings, setSettings] = useState<StoreSettings>({
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

  const handleSettingChange = (section: keyof StoreSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    // Here you would save the settings to your backend
    console.log('Saving settings:', settings);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Store Layout</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/preview"
            target="_blank"
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Preview Store
          </Link>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            <Save size={20} />
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Basics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Store Basics</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Store Name
              </label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings(prev => ({ ...prev, storeName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Primary Color
              </label>
              <input
                type="color"
                value={settings.colors.primary}
                onChange={(e) => handleSettingChange('colors', 'primary', e.target.value)}
                className="w-full h-10 p-1 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Accent Color
              </label>
              <input
                type="color"
                value={settings.colors.accent}
                onChange={(e) => handleSettingChange('colors', 'accent', e.target.value)}
                className="w-full h-10 p-1 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Heading
              </label>
              <input
                type="text"
                value={settings.heroSection.heading}
                onChange={(e) => handleSettingChange('heroSection', 'heading', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subheading
              </label>
              <input
                type="text"
                value={settings.heroSection.subheading}
                onChange={(e) => handleSettingChange('heroSection', 'subheading', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Background Image
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={settings.heroSection.backgroundImage}
                  onChange={(e) => handleSettingChange('heroSection', 'backgroundImage', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Image URL"
                />
                <button className="p-2 border border-gray-300 rounded-md">
                  <Image size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Products Display</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Section Heading
              </label>
              <input
                type="text"
                value={settings.productsSection.heading}
                onChange={(e) => handleSettingChange('productsSection', 'heading', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Products per Row
              </label>
              <select
                value={settings.productsSection.columnsCount}
                onChange={(e) => handleSettingChange('productsSection', 'columnsCount', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value={2}>2 Products</option>
                <option value={3}>3 Products</option>
                <option value={4}>4 Products</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.productsSection.showPrices}
                  onChange={(e) => handleSettingChange('productsSection', 'showPrices', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Show Prices</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.productsSection.showDescriptions}
                  onChange={(e) => handleSettingChange('productsSection', 'showDescriptions', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Show Descriptions</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 