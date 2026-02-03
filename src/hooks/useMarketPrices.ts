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
}

export const useMarketPrices = (categoryFilter: string = 'all'): UseMarketPricesReturn => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [onlineStatus, setOnlineStatus] = useState(isOnline());

  // 1. Live Query: Get prices from IndexedDB
  // If category is 'all', return all. Otherwise filter by category.
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

  // 3. Online/Offline Event Listeners
  useEffect(() => {
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
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
  }, [onlineStatus]); // Re-run if online status changes

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
    isLoading: !allPrices, // Loading initial data from DB
    isSyncing,
    lastUpdated,
    syncStatus,
    triggerSync,
    onlineStatus
  };
};
