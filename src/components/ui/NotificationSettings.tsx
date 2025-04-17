import React from 'react';
import { Bell, BellOff } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';

interface NotificationSettingsProps {
  onChange?: (enabled: boolean) => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onChange }) => {
  const { isPermissionGranted } = useNotifications();

  const handleToggle = async () => {
    if (!isPermissionGranted) {
      const granted = await requestNotificationPermission();
      if (granted) {
        onChange?.(true);
      }
    } else {
      onChange?.(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleToggle}
        className={`p-2 rounded-full ${
          isPermissionGranted
            ? 'bg-cultural-escenicas text-white'
            : 'bg-gray-200 text-gray-500'
        }`}
      >
        {isPermissionGranted ? (
          <Bell className="h-5 w-5" />
        ) : (
          <BellOff className="h-5 w-5" />
        )}
      </button>
      <span className="text-sm text-gray-600 dark:text-gray-300">
        {isPermissionGranted ? 'Notificaciones activadas' : 'Notificaciones desactivadas'}
      </span>
    </div>
  );
};