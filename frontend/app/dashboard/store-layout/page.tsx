'use client';

import { useState } from 'react';
import { Grid, Image, Layout, Plus, Settings, GripVertical } from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface Section {
  id: string;
  type: 'hero' | 'grid' | 'banner';
  title: string;
  active: boolean;
  settings: {
    layout?: 'full' | 'contained';
    columns?: number;
    showFilters?: boolean;
    backgroundImage?: string;
    heading?: string;
    subheading?: string;
  };
}

export default function StoreLayoutPage() {
  const [sections, setSections] = useState<Section[]>([
    {
      id: '1',
      type: 'hero',
      title: 'Hero Section',
      active: true,
      settings: {
        layout: 'full',
        backgroundImage: '/hero-bg.jpg',
        heading: 'Welcome to Our Store',
        subheading: 'Discover our amazing products',
      },
    },
    {
      id: '2',
      type: 'grid',
      title: 'Product Grid',
      active: true,
      settings: {
        layout: 'contained',
        columns: 3,
        showFilters: true,
      },
    },
  ]);

  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleSectionToggle = (id: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === id ? { ...section, active: !section.active } : section
      )
    );
  };

  const handleSettingsChange = (id: string, settings: Partial<Section['settings']>) => {
    setSections(prev =>
      prev.map(section =>
        section.id === id ? { ...section, settings: { ...section.settings, ...settings } } : section
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Store Layout</h1>
        <a 
          href="/preview" 
          target="_blank"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
        >
          Preview Store
        </a>
      </div>

      <DndProvider backend={HTML5Backend}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sections List */}
          <div className="lg:col-span-2 space-y-4">
            {sections.map((section) => (
              <div
                key={section.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow ${
                  activeSection === section.id ? 'ring-2 ring-primary' : ''
                }`}
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{section.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {section.settings.layout} layout
                        {section.type === 'grid' && section.settings.showFilters && ' • Filters enabled'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleSectionToggle(section.id)}
                      className={`px-2 py-1 text-xs rounded-full ${
                        section.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {section.active ? 'Active' : 'Hidden'}
                    </button>
                    <button
                      onClick={() => setActiveSection(section.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Settings size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Settings Panel */}
          <div className="lg:col-span-1">
            {activeSection && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Section Settings
                </h2>
                {sections.find(s => s.id === activeSection)?.type === 'hero' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Heading
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={sections.find(s => s.id === activeSection)?.settings.heading}
                        onChange={(e) =>
                          handleSettingsChange(activeSection, { heading: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Subheading
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={sections.find(s => s.id === activeSection)?.settings.subheading}
                        onChange={(e) =>
                          handleSettingsChange(activeSection, { subheading: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Background Image
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                          value={sections.find(s => s.id === activeSection)?.settings.backgroundImage}
                          onChange={(e) =>
                            handleSettingsChange(activeSection, { backgroundImage: e.target.value })
                          }
                        />
                        <button className="p-2 border border-gray-300 rounded-md">
                          <Image size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {sections.find(s => s.id === activeSection)?.type === 'grid' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Columns
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={sections.find(s => s.id === activeSection)?.settings.columns}
                        onChange={(e) =>
                          handleSettingsChange(activeSection, { columns: Number(e.target.value) })
                        }
                      >
                        <option value="2">2 Columns</option>
                        <option value="3">3 Columns</option>
                        <option value="4">4 Columns</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="showFilters"
                        checked={sections.find(s => s.id === activeSection)?.settings.showFilters}
                        onChange={(e) =>
                          handleSettingsChange(activeSection, { showFilters: e.target.checked })
                        }
                      />
                      <label
                        htmlFor="showFilters"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Show Filters
                      </label>
                    </div>
                  </div>
                )}
                <div className="mt-6">
                  <button className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DndProvider>
    </div>
  );
} 