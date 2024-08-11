// user/Notifications.tsx
import React from 'react';
import { Bell } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

const Notifications: React.FC = () => {
  const notifications = [
    { id: 1, message: 'New order received', time: '2 minutes ago' },
    { id: 2, message: 'Product restocked', time: '1 hour ago' },
    { id: 3, message: 'Payment processed', time: '3 hours ago' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li key={notification.id} className="flex items-start space-x-4 p-4 bg-card rounded-lg">
              <Bell className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium">{notification.message}</p>
                <p className="text-sm text-gray-500">{notification.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
};

export default Notifications;