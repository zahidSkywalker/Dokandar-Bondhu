import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { MarketPrice } from '../types';
import { syncMarketPrices, shouldSyncMarketPrices, isOnline } from '../services/marketService';

interface UseMarketPricesReturn {
  prices: MarketPrice[];
  isLoading: boolean;
  isSyncing: boolean;
  lastUpdated: Date | undefined;
  syncStatus: 'idle' | 'success' | 'error';
  triggerSync: () => Promise<void>;
  onlineStatus: boolean;
  connectionType: string; // NEW: e.g. '4g', 'wifi', 'cellular'
}

export const useMarketPrices = (categoryFilter: string = 'all'): UseMarketPricesReturn => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [onlineStatus, setOnlineStatus] = useState(isOnline());
  const [connectionType, setConnectionType] = useState<string>('unknown'); // NEW STATE

  // 1. Live Query: Get prices from IndexedDB
  const allPrices = useLiveQuery(() => db.marketPrices.toArray(), []);
  
  // 2. Client-side filtering for categories
  const prices = allPrices ? (categoryFilter === 'all' 
    ? allPrices 
    : allPrices.filter(p => p.category === categoryFilter)) 
  : [];

  // Get last updated time
  const lastUpdated = allPrices && allPrices.length > 0 
    ? new Date(allPrices[0].dateFetched) 
    : undefined;

  // 3. Online/Offline & Network Type Listeners
  useEffect(() => {
    const handleOnline = () => {
      setOnlineStatus(true);
      updateConnectionInfo();
    };
    
    const handleOffline = () => {
      setOnlineStatus(false);
      setConnectionType('offline');
    };

    // NEW: Function to update connection type (Mobile vs Wifi)
    const updateConnectionInfo = () => {
      // Cast to any because NetworkInformation API is experimental/extended
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (connection) {
        // effectiveType usually returns '4g', '3g', '2g', 'slow-2g'
        // type returns 'cellular', 'wifi', 'ethernet'
        const type = connection.type || connection.effectiveType || 'unknown';
        setConnectionType(type);
      } else {
        setConnectionType('online'); // Fallback if API not supported
      }
    };

    // Initial check
    if (isOnline()) {
      updateConnectionInfo();
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Listen for network type changes (e.g. Wifi -> Data)
    if ((navigator as any).connection) {
      (navigator as any).connection.addEventListener('change', updateConnectionInfo);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if ((navigator as any).connection) {
        (navigator as any).connection.removeEventListener('change', updateConnectionInfo);
      }
    };
  }, []);

  // 4. Auto-sync logic on mount
  useEffect(() => {
    const initSync = async () => {
      // Only check sync logic if we are online
      if (onlineStatus) {
        const needSync = await shouldSyncMarketPrices();
        if (needSync) {
          await triggerSync();
        }
      }
    };

    initSync();
  }, [onlineStatus]); 

  // 5. Manual Sync Trigger
  const triggerSync = async () => {
    if (!isOnline()) {
      setSyncStatus('error');
      return;
    }

    setIsSyncing(true);
    setSyncStatus('idle');
    
    const result = await syncMarketPrices();
    
    setIsSyncing(false);
    if (result.success) {
      setSyncStatus('success');
      // Clear success message after 3 seconds
      setTimeout(() => setSyncStatus('idle'), 3000);
    } else {
      setSyncStatus('error');
    }
  };

  return {
    prices,
    isLoading: !allPrices,
    isSyncing,
    lastUpdated,
    syncStatus,
    triggerSync,
    onlineStatus,
    connectionType // NEW: Return connection type
  };
};
