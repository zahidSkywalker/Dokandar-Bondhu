import { useEffect, useRef, useState } from 'react';
import { db } from '../db/db';

export interface CommodityPrice {
  id?: number;
  name: string;
  unit: string;
  minPrice: number;
  maxPrice: number;
  date: string;
}

export const useMarketPrices = () => {
  const [prices, setPrices] = useState<CommodityPrice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  const workerRef = useRef<Worker | null>(null);

  // Online / Offline listener
  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  // Init worker
  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/marketPrices.worker.ts', import.meta.url),
      { type: 'module' }
    );

    workerRef.current.onmessage = async (event) => {
      if (event.data.type === 'prices') {
        setPrices(event.data.payload);
        setLastUpdate(new Date().toISOString());
        setIsLoading(false);

        await db.marketPrices.clear();
        await db.marketPrices.bulkPut(event.data.payload);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  // Load cached data
  useEffect(() => {
    (async () => {
      const cached = await db.marketPrices.toArray();
      if (cached.length) {
        setPrices(cached);
        setLastUpdate(cached[0].date);
      }
    })();
  }, []);

  const refreshPrices = () => {
    if (!workerRef.current) return;
    setIsLoading(true);
    workerRef.current.postMessage({ type: 'FETCH' });
  };

  return { prices, isLoading, lastUpdate, refreshPrices, isOnline };
};
