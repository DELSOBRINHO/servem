import React, { createContext, useContext } from 'react';
import { useNotification } from '../hooks/useNotification';
import Notification from '../components/Notification';

interface NotificationContextType {
  success: (message: string) => number;
  error: (message: string) => number;
  info: (message: string) => number;
  warning: (message: string) => number;
  removeNotification: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notifications, success, error, info, warning, removeNotification } = useNotification();

  return (
    <NotificationContext.Provider value={{ success, error, info, warning, removeNotification }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-4 w-80">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            type={notification.type}
            message={notification.message}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};
