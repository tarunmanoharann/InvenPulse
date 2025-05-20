'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Bell, CheckCircle, Archive, AlertTriangle } from 'lucide-react';
import { notificationService, type Notification, type NotificationStats } from '@/lib/services/notificationService';
import { useToast } from '@/components/ui/use-toast';
import { ColumnDef } from '@tanstack/react-table'; // Make sure this import exists

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const pageSize = 10;

  const fetchNotifications = async (page: number) => {
    try {
      const skip = (page - 1) * pageSize;
      const data = await notificationService.getUserNotifications({
        skip,
        limit: pageSize,
      });
      setNotifications(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch notifications",
        variant: "destructive",
      });
    }
  };

  const fetchStats = async () => {
    try {
      const data = await notificationService.getNotificationStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch notification stats:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchNotifications(currentPage),
        fetchStats(),
      ]);
      setLoading(false);
    };
    loadData();
  }, [currentPage]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      await Promise.all([
        fetchNotifications(currentPage),
        fetchStats(),
      ]);
      toast({
        title: "Success",
        description: "Notification marked as read",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsArchived = async (id: string) => {
    try {
      await notificationService.markAsArchived(id);
      await Promise.all([
        fetchNotifications(currentPage),
        fetchStats(),
      ]);
      toast({
        title: "Success",
        description: "Notification archived",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to archive notification",
        variant: "destructive",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      await Promise.all([
        fetchNotifications(currentPage),
        fetchStats(),
      ]);
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      });
    }
  };

  // Define the priority colors with proper type
  const priorityColors: Record<string, string> = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800',
  };

  // Define columns with proper typing
  const columns: ColumnDef<Notification>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'message',
      header: 'Message',
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.getValue('type') as string;
        return (
          <span className="capitalize">{type.replace('_', ' ')}</span>
        );
      },
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => {
        const priority = row.getValue('priority') as string;
        return (
          <span className={`px-2 py-1 rounded-full text-xs capitalize ${priorityColors[priority] || ''}`}>
            {priority}
          </span>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const notification = row.original;
        return (
          <div className="flex items-center gap-2">
            {!notification.is_read && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <CheckCircle className="w-4 h-4" />
              </Button>
            )}
            {!notification.is_archived && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMarkAsArchived(notification.id)}
              >
                <Archive className="w-4 h-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <Button onClick={handleMarkAllAsRead}>
          Mark All as Read
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_count || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.unread_count || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats?.priority_counts?.high || 0) + (stats?.priority_counts?.critical || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={notifications}
        loading={loading}
        pagination={{
          currentPage,
          pageSize,
          totalItems: stats?.total_count || 0,
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
}