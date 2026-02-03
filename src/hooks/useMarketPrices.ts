import { useState, useEffect } from 'react';
import { db } from '../db/db';

export interface CommodityPrice {
  name: string;
  unit: string;
  minPrice: number;
  maxPrice: number;
  date: string; // ISO Date string
}

export const useMarketPrices = () => {
  const [prices, setPrices] = useState<CommodityPrice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Initialize Worker
  let worker: Worker;

  useEffect(() => {
    try {
      // Create worker from inline blob
      const blob = new Blob([`self.addEventListener('install', (event) => { ... }`], { type: 'text/javascript' }]);
      worker = new Worker(URL.createObjectURL(blob));
      
      // Communication Handler
      worker.onmessage = (event) => {
        if (event.data.type === 'parse') {
          setLastUpdate(new Date().toLocaleTimeString());
          setPrices(event.data);
          setIsLoading(false);
        }
      };

      // Cleanup
      return () => { worker.terminate(); };
    } catch (e) {
      console.error("Worker Error:", e);
    }
  }, []);

  // Refresh Logic (Daily when App becomes visible/Online)
  const refreshPrices = () => {
    setIsLoading(true);
    worker.postMessage({ type: 'fetch', url: 'https://bpc.gov.bd/bangla/market-price.html' });
  };

  // Offline-first: Load from Dexie if worker fails or we want to start immediately
  useEffect(() => {
    const loadFromStorage = async () => {
      try {
        const storedPrices = await db.table('marketPrices').toArray();
        if (storedPrices.length > 0) {
          setPrices(storedPrices);
          const dates = storedPrices.map(p => p.date);
          if (dates.length > 0) {
            setLastUpdate(new Date(dates[0]).toLocaleTimeString());
          }
        }
      } catch (e) {
        console.error("Dexie Load Error:", e);
      }
    };

    loadFromStorage();
    // Store successful fetches into Dexie (Caching)
    worker.onmessage = (event) => {
      if (event.data.type === 'parse') {
        (async () => {
          // Deduplicate by name before saving
          const existing = await db.table('marketPrices').toArray();
          const existingNames = new Set(existing.map(p => p.name));
          const newPrices = event.data.filter(p => !existingNames.has(p.name));
          
          await db.table('marketPrices').bulkPut(newPrices);
        })();
      }
    };

    // Ping worker every time tab is clicked to check connectivity
    worker.postMessage({ type: 'ping' });
  }, []);

  return { prices, isLoading, lastUpdate, refreshPrices, isOnline };
};
