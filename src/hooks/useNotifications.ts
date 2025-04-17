import { useState, useEffect } from 'react';
import { requestNotificationPermission } from '../utils/notificationUtils';

export function useNotifications() {
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      const hasPermission = await requestNotificationPermission();
      setIsPermissionGranted(hasPermission);
    };

    checkPermission();
  }, []);

  return { isPermissionGranted };
}