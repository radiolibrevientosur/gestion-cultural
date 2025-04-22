import React from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useOffline } from '../../hooks/useOffline';
import { motion, AnimatePresence } from 'framer-motion';

export const OfflineIndicator: React.FC = () => {
  const { isOnline, isSyncing, pendingChanges, syncData } = useOffline();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed top-4 right-16 flex items-center space-x-2 px-1 py-1 rounded-lg shadow-lg ${
          isOnline ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
        }`}
      >
        {isOnline ? (
          <>
            <Wifi className="h-5 w-5" />
            
          </>
        ) : (
          <>
            <WifiOff className="h-5 w-5" />
          
          </>
        )}

        {pendingChanges > 0 && (
          <div className="ml-2 flex items-center space-x-2">
            <span className="text-sm">({pendingChanges} cambios pendientes)</span>
            <button
              onClick={() => syncData()}
              disabled={!isOnline || isSyncing}
              className="p-1 hover:bg-green-100 rounded-full disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};