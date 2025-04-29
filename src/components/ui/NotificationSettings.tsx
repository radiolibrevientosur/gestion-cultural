import React from 'react';
import { Bell, BellOff } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';

interface NotificationSettingsProps {
  onChange?: (enabled: boolean) => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onChange }) => {
  const { isPermissionGranted, requestNotificationPermission } = useNotifications();

  const handleToggle = async () => {
    if (!isPermissionGranted) {
      const granted = await requestNotificationPermission();
      onChange?.(granted);
    } else {
      onChange?.(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
    >
      {isPermissionGranted ? (
        <>
          <Bell className="h-4 w-4 mr-2" />
          Notificaciones activadas
        </>
      ) : (
        <>
          <BellOff className="h-4 w-4 mr-2" />
          Activar notificaciones
        </>
      )}
    </button>
  );
};