import { useState } from 'react';
import { requestNotificationPermission } from '../utils/notificationUtils';

export const useNotifications = () => {
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const [isPermissionGranted, setIsPermissionGranted] = useState(false);

  const showSuccess = (message: string) => {
    setNotification({ message, type: 'success' });
    setTimeout(() => setNotification(null), 3000);
  };

  const showError = (message: string) => {
    setNotification({ message, type: 'error' });
    setTimeout(() => setNotification(null), 5000);
  };

  const checkPermission = async () => {
    const hasPermission = await requestNotificationPermission();
    setIsPermissionGranted(hasPermission);
  };

  return {
    notification,
    showSuccess,
    showError,
    isPermissionGranted,
    checkPermission
  };
};