'use client';

const mockActivities = [
  {
    id: 1,
    user: 'John Doe',
    action: 'added new product',
    item: 'Wireless Headphones',
    timestamp: '10 minutes ago',
  },
  {
    id: 2,
    user: 'Jane Smith',
    action: 'updated stock for',
    item: 'Smart Watch',
    timestamp: '1 hour ago',
  },
  {
    id: 3,
    user: 'David Johnson',
    action: 'created a purchase order for',
    item: 'Bluetooth Speaker',
    timestamp: '3 hours ago',
  },
  {
    id: 4,
    user: 'Emily Wilson',
    action: 'processed an order for',
    item: 'USB-C Cable',
    timestamp: '6 hours ago',
  },
  {
    id: 5,
    user: 'Michael Brown',
    action: 'deleted product',
    item: 'HDMI Adapter',
    timestamp: '1 day ago',
  },
];

export default function ActivityLog() {
  return (
    <div className="mt-4 space-y-4">
      {mockActivities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start space-x-3 border-b border-gray-200 dark:border-gray-700 pb-3"
        >
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
            {activity.user.charAt(0)}
          </div>
          
          {/* Activity details */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-800 dark:text-gray-200">
              <span className="font-medium">{activity.user}</span>{' '}
              {activity.action}{' '}
              <span className="font-medium">{activity.item}</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {activity.timestamp}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
} 