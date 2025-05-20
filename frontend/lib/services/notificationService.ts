import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface Notification {
  id: string;
  type: 'low_stock' | 'order_status' | 'price_change' | 'expiry' | 'system';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  reference_type?: string;
  reference_id?: string;
  metadata?: any;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
  read_at?: string;
  archived_at?: string;
}

export interface NotificationPreferences {
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  notification_types: {
    low_stock: boolean;
    order_status: boolean;
    price_change: boolean;
    expiry: boolean;
    system: boolean;
  };
  minimum_priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface NotificationStats {
  total_count: number;
  unread_count: number;
  priority_counts: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  type_counts: {
    low_stock: number;
    order_status: number;
    price_change: number;
    expiry: number;
    system: number;
  };
}

class NotificationService {
  async getUserNotifications(params?: {
    skip?: number;
    limit?: number;
    include_archived?: boolean;
    type?: string;
    priority?: string;
    from_date?: string;
    to_date?: string;
  }): Promise<Notification[]> {
    const response = await axios.get(`${API_URL}/notifications/me`, { params });
    return response.data;
  }

  async getNotificationStats(params?: {
    from_date?: string;
    to_date?: string;
  }): Promise<NotificationStats> {
    const response = await axios.get(`${API_URL}/notifications/me/stats`, { params });
    return response.data;
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    const response = await axios.put(`${API_URL}/notifications/${notificationId}`, {
      is_read: true,
    });
    return response.data;
  }

  async markAsArchived(notificationId: string): Promise<Notification> {
    const response = await axios.put(`${API_URL}/notifications/${notificationId}`, {
      is_archived: true,
    });
    return response.data;
  }

  async markAllAsRead(type?: string): Promise<{ message: string }> {
    const response = await axios.post(`${API_URL}/notifications/mark-all-read`, {
      notification_type: type,
    });
    return response.data;
  }

  async getPreferences(): Promise<NotificationPreferences> {
    const response = await axios.get(`${API_URL}/notifications/preferences/me`);
    return response.data;
  }

  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    const response = await axios.put(`${API_URL}/notifications/preferences/me`, preferences);
    return response.data;
  }
}

export const notificationService = new NotificationService(); 