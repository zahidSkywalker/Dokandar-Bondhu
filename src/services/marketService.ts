import { db } from '../db/db';
import { MarketPrice } from '../types';

// CHANGE: Call your own Vercel API instead of TCB directly
const MY_API_URL = '/api/market-prices';

export const isOnline = (): boolean => navigator.onLine;

// Simple parser for frontend data
const parseApiData = (data: any[]): Omit<MarketPrice, 'id' | 'dateFetched'>[] => {
  return data.map((item: any) => ({
    nameEn: item.nameEn,
    nameBn: item.nameBn,
    unit: item.unit,
    minPrice: item.minPrice,
    maxPrice: item.maxPrice,
    category: 'essentials' // You can refine logic here or do it in API
  }));
};

export const syncMarketPrices = async (): Promise<{ success: boolean; count: number; message: string }> => {
  if (!isOnline()) {
    return { success: false, count: 0, message: 'No internet connection' };
  }

  try {
    // Fetch from your own API (No CORS issues now)
    const response = await fetch(MY_API_URL);
    
    if (!response.ok) throw new Error('Server Error');

    const json = await response.json();

    if (!json.success || json.data.length === 0) {
      return { success: false, count: 0, message: 'No data found from API' };
    }

    const parsedData = parseApiData(json.data);

    // Update Database
    const dataWithDate = parsedData.map(item => ({ ...item, dateFetched: new Date() }));

    await db.transaction('rw', db.marketPrices, async () => {
      await db.marketPrices.clear();
      await db.marketPrices.bulkAdd(dataWithDate);
    });

    return { success: true, count: parsedData.length, message: 'Updated successfully' };

  } catch (error) {
    console.error('Sync Error:', error);
    return { 
      success: false, 
      count: 0, 
      message: 'Connection failed to backend.' 
    };
  }
};

export const shouldSyncMarketPrices = async (): Promise<boolean> => {
  const latestPrice = await db.marketPrices.orderBy('dateFetched').last();
  if (!latestPrice) return true; 
  const lastSync = new Date(latestPrice.dateFetched);
  const now = new Date();
  const diffInHours = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);
  return diffInHours >= 24; 
};
