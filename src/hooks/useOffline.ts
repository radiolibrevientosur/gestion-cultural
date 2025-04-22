import { useState, useEffect } from 'react';
import { db } from '../services/offlineStore';

export function useOffline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(0);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      if (navigator.onLine) {
        syncData();
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  useEffect(() => {
    const checkPendingChanges = async () => {
      const count = await db.syncQueue.count();
      setPendingChanges(count);
    };

    checkPendingChanges();
    const interval = setInterval(checkPendingChanges, 5000);

    return () => clearInterval(interval);
  }, []);

  const syncData = async () => {
    if (isSyncing || !navigator.onLine) return;

    try {
      setIsSyncing(true);
      await db.processSyncQueue();
    } catch (error) {
      console.error('Error syncing data:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isOnline,
    isSyncing,
    pendingChanges,
    syncData
  };
}