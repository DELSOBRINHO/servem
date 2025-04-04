import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Transition from './Transition';

interface NotificationProps {
  type: 'success' | 'error';
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ type, message, isVisible, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
    } else {
      setTimeout(() => setShow(false), 300); // Delay to allow animation to complete
    }
  }, [isVisible]);

  if (!isVisible && !show) return null;

  return (
    <Transition
      show={isVisible}
      enter="transition ease-out duration-300"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-200"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
      className="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end z-50"
    >
      <div
        className={`max-w-sm w-full ${
          type === 'success' ? 'bg-green-50' : 'bg-red-50'
        } shadow-lg rounded-lg pointer-events-auto ring-1 ${
          type === 'success' ? 'ring-green-500' : 'ring-red-500'
        } ring-opacity-5 overflow-hidden`}
        role="alert"
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {type === 'success' ? (
                <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
              ) : (
                <XCircleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
              )}
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className={`text-sm font-medium ${type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {message}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className={`bg-${type === 'success' ? 'green' : 'red'}-50 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${
                  type === 'success' ? 'green' : 'red'
                }-500`}
                onClick={onClose}
              >
                <span className="sr-only">Fechar</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
};

export default Notification;
