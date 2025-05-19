'use client';

import { useState } from 'react';
import { Bell, Package, AlertTriangle, Check, Clock, Filter } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'success';
  timestamp: string;
  isRead: boolean;
}

export default function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'alerts'>('all');
  
  // Dummy data - replace with actual API call
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Low Stock Alert',
      message: 'Wireless Headphones stock is below threshold (5 units remaining)',
      type: 'alert',
      timestamp: '2024-03-15 09:30',
      isRead: false,
    },
    {
      id: '2',
      title: 'Order Received',
      message: 'New incoming order from TechSupply Co (Order #12345)',
      type: 'info',
      timestamp: '2024-03-15 08:45',
      isRead: true,
    },
    {
      id: '3',
      title: 'Shipment Delivered',
      message: 'Order #12340 has been successfully delivered to customer',
      type: 'success',
      timestamp: '2024-03-14 16:20',
      isRead: false,
    },
    {
      id: '4',
      title: 'Stock Update Required',
      message: 'Please update stock count for 3 products',
      type: 'alert',
      timestamp: '2024-03-14 14:15',
      isRead: true,
    },
  ];

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.isRead);
      case 'alerts':
        return notifications.filter(n => n.type === 'alert');
      default:
        return notifications;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="text-red-500" size={20} />;
      case 'success':
        return <Check className="text-green-500" size={20} />;
      default:
        return <Package className="text-blue-500" size={20} />;
    }
  };

  const getNotificationStyles = (type: string) => {
    switch (type) {
      case 'alert':
        return 'border-red-100 dark:border-red-800';
      case 'success':
        return 'border-green-100 dark:border-green-800';
      default:
        return 'border-blue-100 dark:border-blue-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Bell className="text-primary mr-2" size={24} />
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Notifications</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Filter className="text-gray-400 mr-2" size={20} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'unread' | 'alerts')}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm"
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread</option>
              <option value="alerts">Alerts Only</option>
            </select>
          </div>
          <button className="text-primary hover:text-primary/80 text-sm font-medium">
            Mark all as read
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Notifications</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">24</h3>
            </div>
            <Bell className="text-primary" size={24} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Unread</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">8</h3>
            </div>
            <Clock className="text-primary" size={24} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Alerts</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">3</h3>
            </div>
            <AlertTriangle className="text-primary" size={24} />
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {getFilteredNotifications().map((notification) => (
          <div
            key={notification.id}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 ${
              getNotificationStyles(notification.type)
            } ${!notification.isRead ? 'bg-blue-50 dark:bg-gray-750' : ''}`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {notification.title}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {notification.timestamp}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 