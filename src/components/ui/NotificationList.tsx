import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Bell, Check, Trash2 } from 'lucide-react';
import { useCultural } from '../../context/CulturalContext';
import type { Notification } from '../../types/cultural';

interface NotificationListProps {
  onClose: () => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({ onClose }) => {
  const { state, dispatch } = useCultural();
  const unreadNotifications = state.notifications.filter(n => !n.read);
  const readNotifications = state.notifications.filter(n => n.read);

  const handleMarkAsRead = (notification: Notification) => {
    dispatch({
      type: 'MARK_NOTIFICATION_READ',
      payload: notification.id
    });
  };

  const handleDelete = (id: string) => {
    dispatch({
      type: 'DELETE_NOTIFICATION',
      payload: id
    });
  };

  const renderNotification = (notification: Notification) => (
    <div
      key={notification.id}
      className={`p-4 rounded-lg mb-2 ${
        notification.read
          ? 'bg-gray-50 dark:bg-gray-800'
          : 'bg-blue-50 dark:bg-blue-900'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className={`font-medium ${
            notification.read
              ? 'text-gray-900 dark:text-gray-100'
              : 'text-blue-900 dark:text-blue-100'
          }`}>
            {notification.title}
          </h4>
          <p className={`text-sm mt-1 ${
            notification.read
              ? 'text-gray-500 dark:text-gray-400'
              : 'text-blue-700 dark:text-blue-300'
          }`}>
            {notification.message}
          </p>
          <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">
            {format(notification.date, "d 'de' MMMM 'a las' HH:mm", { locale: es })}
          </p>
        </div>
        <div className="flex space-x-2">
          {!notification.read && (
            <button
              onClick={() => handleMarkAsRead(notification)}
              className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
            >
              <Check className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => handleDelete(notification.id)}
            className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" onClick={onClose}>
      <div className="absolute inset-0 bg-black bg-opacity-25" />
      <div className="absolute inset-y-0 right-0 max-w-sm w-full">
        <div
          className="h-full bg-white dark:bg-gray-900 shadow-xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Notificaciones
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              >
                <span className="sr-only">Cerrar</span>
                <Bell className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-4 overflow-y-auto max-h-[calc(100vh-8rem)]">
            {unreadNotifications.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  No leídas
                </h4>
                {unreadNotifications.map(renderNotification)}
              </div>
            )}

            {readNotifications.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Anteriores
                </h4>
                {readNotifications.map(renderNotification)}
              </div>
            )}

            {state.notifications.length === 0 && (
              <div className="text-center py-8">
                <Bell className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
                <p className="mt-4 text-gray-500 dark:text-gray-400">
                  No hay notificaciones
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};