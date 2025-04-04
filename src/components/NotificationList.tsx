import React from 'react';
import { useNotificationContext } from '../contexts/NotificationContext';
import { XMarkIcon } from '@heroicons/react/24/outline';

const NotificationList: React.FC = () => {
  const { notifications, removeNotification } = useNotificationContext();

  if (notifications.length === 0) {
    return (
      <div className="px-4 py-3 text-sm text-gray-500 text-center">
        Nenhuma notificação
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`px-4 py-3 flex items-start justify-between ${
            notification.type === 'success' ? 'bg-green-50' :
            notification.type === 'error' ? 'bg-red-50' :
            notification.type === 'warning' ? 'bg-yellow-50' :
            'bg-blue-50'
          } mb-1`}
        >
          <div className="flex-1">
            <p className={`text-sm font-medium ${
              notification.type === 'success' ? 'text-green-800' :
              notification.type === 'error' ? 'text-red-800' :
              notification.type === 'warning' ? 'text-yellow-800' :
              'text-blue-800'
            }`}>
              {notification.message}
            </p>
          </div>
          <button
            type="button"
            className="ml-2 text-gray-400 hover:text-gray-500"
            onClick={() => removeNotification(notification.id)}
          >
            <span className="sr-only">Fechar</span>
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
