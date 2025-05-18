'use client';

import { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface OverviewCardProps {
  title: string;
  value: string;
  icon: string;
  trend: string;
  trendDirection: 'up' | 'down';
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export default function OverviewCard({
  title,
  value,
  icon,
  trend,
  trendDirection,
  variant = 'default',
}: OverviewCardProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'danger':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default:
        return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  const getTrendClasses = () => {
    return trendDirection === 'up'
      ? 'text-green-600 dark:text-green-400'
      : 'text-red-600 dark:text-red-400';
  };

  // Dynamically import the icon from lucide-react
  const IconComponent = require('lucide-react')[icon] as LucideIcon;

  return (
    <div
      className={`rounded-lg border p-4 shadow ${getVariantClasses()}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </span>
        {IconComponent && (
          <IconComponent className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        )}
      </div>
      <div className="mt-3">
        <span className="text-2xl font-bold">{value}</span>
        <div className={`mt-1 flex items-center ${getTrendClasses()}`}>
          {trendDirection === 'up' ? (
            <ArrowUpRight className="mr-1 h-4 w-4" />
          ) : (
            <ArrowDownRight className="mr-1 h-4 w-4" />
          )}
          <span className="text-xs font-medium">{trend}</span>
        </div>
      </div>
    </div>
  );
} 