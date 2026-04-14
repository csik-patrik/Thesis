import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { HubConnectionBuilder, type HubConnection } from '@microsoft/signalr';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';
import type { NotificationType } from '../Types/NotificationTypes';

interface NotificationContextType {
  notifications: NotificationType[];
  unreadCount: number;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const connectionRef = useRef<HubConnection | null>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const fetchNotifications = useCallback(async () => {
    if (!user?.token) return;
    try {
      const res = await axios.get<NotificationType[]>(
        'http://localhost:5000/notifications',
        { headers: { Authorization: `Bearer ${user.token}` } },
      );
      setNotifications(res.data);
    } catch {
      // silently fail — not critical
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      connectionRef.current?.stop();
      connectionRef.current = null;
      setNotifications([]);
      return;
    }

    const connection = new HubConnectionBuilder()
      .withUrl('http://localhost:5000/hubs/notifications')
      .withAutomaticReconnect()
      .build();

    connection.on('ReceiveNotification', (notification: NotificationType) => {
      setNotifications((prev) => [notification, ...prev]);
      toast.info(notification.message);
    });

    connection
      .start()
      .then(() => {
        connection.invoke('JoinUserGroup', user.id);
        fetchNotifications();
      })
      .catch((err) => console.error('SignalR connection error:', err));

    connectionRef.current = connection;

    return () => {
      connection.stop();
    };
  }, [user, fetchNotifications]);

  const markAsRead = useCallback(
    async (id: number) => {
      if (!user?.token) return;
      try {
        await axios.put(
          `http://localhost:5000/notifications/${id}/read`,
          {},
          { headers: { Authorization: `Bearer ${user.token}` } },
        );
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        );
      } catch {
        // silently fail
      }
    },
    [user],
  );

  const markAllAsRead = useCallback(async () => {
    if (!user?.token) return;
    try {
      await axios.put(
        'http://localhost:5000/notifications/read-all',
        {},
        { headers: { Authorization: `Bearer ${user.token}` } },
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // silently fail
    }
  }, [user]);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      'useNotifications must be used inside NotificationProvider',
    );
  return ctx;
}
