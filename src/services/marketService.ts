import { db } from '../db/db';
import { MarketPrice } from '../types';
import { getMarketPrices } from '../data/marketData'; // Import Data

export const isOnline = (): boolean => navigator.onLine;

/**
 * SIMULATED SYNC FUNCTION (Using JSON File)
 * Logic: Read from file -> Simulate Delay -> Save to DB.
 */
export const syncMarketPrices = async (): Promise<{ success: boolean; count: number; message: string }> => {
  // 1. Simulate Network Delay (1.5 seconds) to show Loading Animation
  await new Promise(resolve => setTimeout(resolve, 1500));

  try {
    // 2. Get Data from JSON File
    const dataFromJson = getMarketPrices();

    if (dataFromJson.length === 0) {
      return { success: false, count: 0, message: 'No data found in JSON' };
    }

    // 3. "Fluctuate" Prices (Logic requested: Change prices simultaneously)
    // We add a small random variance to make it feel "Live" every sync.
    // Remove this map loop if you want STATIC prices.
    const simulatedData = dataFromJson.map(item => {
      const variance = Math.floor(Math.random() * 3) - 1; // +/- 1 or 2 Taka change
      return {
        ...item,
        minPrice: Math.max(0, item.minPrice + variance),
        maxPrice: Math.max(0, item.maxPrice + variance)
      };
    });

    // 4. Update Database
    const dataWithDate = simulatedData.map(item => ({ ...item, dateFetched: new Date() }));

    await db.transaction('rw', db.marketPrices, async () => {
      await db.marketPrices.clear();
      await db.marketPrices.bulkAdd(dataWithDate);
    });

    console.log(`Synced ${simulatedData.length} items from JSON File.`);

    return { success: true, count: simulatedData.length, message: 'Updated successfully' };

  } catch (error) {
    console.error('Sync Error:', error);
    return { 
      success: false, 
      count: 0, 
      message: 'Failed to process local data.' 
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
