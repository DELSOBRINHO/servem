import React, { useEffect } from 'react';
import { useNotificationContext } from '../contexts/NotificationContext';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/solid';

const Toast: React.FC = () => {
  const { notifications, removeNotification } = useNotificationContext();

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        removeNotification(notifications[0].id);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-0 p-4 w-full md:max-w-sm z-50 space-y-2">
      {notifications.map((notification) => {
        let bgColor, textColor, icon;

        switch (notification.type) {
          case 'success':
            bgColor = 'bg-green-50';
            textColor = 'text-green-800';
            icon = <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />;
            break;
          case 'error':
            bgColor = 'bg-red-50';
            textColor = 'text-red-800';
            icon = <ExclamationCircleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />;
            break;
          case 'warning':
            bgColor = 'bg-yellow-50';
            textColor = 'text-yellow-800';
            icon = <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" aria-hidden="true" />;
            break;
          default:
            bgColor = 'bg-blue-50';
            textColor = 'text-blue-800';
            icon = <InformationCircleIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />;
        }

        return (
          <div
            key={notification.id}
            className={`${bgColor} p-4 rounded-md shadow-lg transition-all duration-300 ease-in-out transform translate-x-0`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">{icon}</div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className={`text-sm font-medium ${textColor}`}>{notification.message}</p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className={`bg-transparent rounded-md inline-flex ${textColor} hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-servem-primary`}
                  onClick={() => removeNotification(notification.id)}
                >
                  <span className="sr-only">Fechar</span>
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
