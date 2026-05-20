import React, { createContext, useContext, useState, useCallback } from "react";

export type NotificationType =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "custom";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  icon?: string;
  action?: string;
  actionLabel?: string;
  isRead?: boolean;
  isPinned?: boolean;
  expiresAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt">
  ) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  togglePin: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "createdAt">) => {
      const id = `notif-${Date.now()}-${Math.random()}`;
      const newNotification: Notification = {
        ...notification,
        id,
        createdAt: new Date(),
      };

      setNotifications(prev => [newNotification, ...prev]);

      // Auto-remove after expiration time or 5 seconds
      const duration = notification.expiresAt
        ? notification.expiresAt.getTime() - Date.now()
        : 5000;

      if (duration > 0) {
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== id));
        }, duration);
      }
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const togglePin = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        togglePin,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }
  return context;
};
