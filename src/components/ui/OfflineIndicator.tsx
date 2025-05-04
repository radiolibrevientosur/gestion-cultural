import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useOffline } from '../../hooks/useOffline';

export const OfflineIndicator: React.FC = () => {
  const { isOnline } = useOffline();

  return (
    <div className={`flex items-center px-2 py-1 rounded-md ${
      isOnline ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
    }`}>
      {isOnline ? (
        <Wifi className="h-5 w-5" />
      ) : (
        <WifiOff className="h-5 w-5" />
      )}
    </div>
  );
};