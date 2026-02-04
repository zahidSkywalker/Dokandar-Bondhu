import { db } from '../db/db';
import { MarketPrice } from '../types';

// TCB Official Daily Price Page
const TCB_TARGET_URL = 'https://tcb.gov.bd/site/view/daily-market-price';

// ==========================================
// FIX: Use CORS Proxy to bypass TCB Security
// ==========================================
const PROXY_URL = 'https://api.allorigins.win/raw?url=';

// Helper to check network status
export const isOnline = (): boolean => navigator.onLine;

/**
 * Parses the HTML content from TCB to extract market data.
 */
const parseTCBHtml = (htmlText: string): Omit<MarketPrice, 'id' | 'dateFetched'>[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, 'text/html');
  const rows = Array.from(doc.querySelectorAll('table tr')); 
  
  const prices: Omit<MarketPrice, 'id' | 'dateFetched'>[] = [];
  const today = new Date();

  rows.forEach((row) => {
    const cells = Array.from(row.querySelectorAll('td'));
    if (cells.length < 3) return; 

    const nameRaw = cells[0].innerText.trim();
    const unitRaw = cells[cells.length - 2]?.innerText.trim() || 'kg'; 
    const priceRaw = cells[cells.length - 1]?.innerText.trim(); 

    if (!nameRaw || nameRaw === 'Commodity' || nameRaw === 'পণ্যের নাম') return;

    // Safe Bangla Digit Conversion
    const banglaDigits = '০১২৩৪৫৬৭৮৯';
    const englishDigits = '0123456789';
    
    const cleanPrice = priceRaw.replace(/[০-৯]/g, (d) => {
      const index = banglaDigits.indexOf(d);
      return index !== -1 ? englishDigits[index] : d;
    });

    const priceMatch = cleanPrice.match(/(\d+)\s*[-–]\s*(\d+)/);

    if (priceMatch) {
      const minPrice = parseInt(priceMatch[1]);
      const maxPrice = parseInt(priceMatch[2]);

      let category = 'essentials';
      const nameLower = nameRaw.toLowerCase();
      if (nameLower.includes('চাল') || nameLower.includes('rice') || nameLower.includes('গম')) category = 'rice';
      else if (nameLower.includes('সবজ') || nameLower.includes('vegetable') || nameLower.includes('বেগুন') || nameLower.includes('পেঁয়াজ')) category = 'vegetables';
      else if (nameLower.includes('মসলা') || nameLower.includes('spice') || nameLower.includes('রসুন')) category = 'spices';
      else if (nameLower.includes('মাছ') || nameLower.includes('fish') || nameLower.includes('মাংস') || nameLower.includes('meat')) category = 'meat';
      else if (nameLower.includes('ফল') || nameLower.includes('fruit')) category = 'fruits';

      prices.push({
        nameEn: nameRaw, 
        nameBn: nameRaw,
        unit: unitRaw,
        minPrice,
        maxPrice,
        category
      });
    }
  });

  return prices;
};

/**
 * Main Sync Function
 * Fetches data via Proxy, parses it, and updates Dexie.
 */
export const syncMarketPrices = async (): Promise<{ success: boolean; count: number; message: string }> => {
  if (!isOnline()) {
    return { success: false, count: 0, message: 'No internet connection' };
  }

  try {
    // 1. Fetch using CORS Proxy
    // We use allorigins.win to bypass the browser blocking TCB
    const response = await fetch(PROXY_URL + encodeURIComponent(TCB_TARGET_URL), {
      method: 'GET',
      headers: {
        // The proxy handles standard headers
      },
    });

    if (!response.ok) throw new Error('Proxy network response was not ok');

    const htmlText = await response.text();

    // 2. Parse
    const parsedData = parseTCBHtml(htmlText);

    if (parsedData.length === 0) {
      return { success: false, count: 0, message: 'No data found on source page. TCB might be down.' };
    }

    // 3. Update Database
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
      message: 'Connection failed. Try again or check if TCB website is accessible.' 
    };
  }
};

/**
 * Determines if a sync is needed
 */
export const shouldSyncMarketPrices = async (): Promise<boolean> => {
  const latestPrice = await db.marketPrices.orderBy('dateFetched').last();
  
  if (!latestPrice) return true; 

  const lastSync = new Date(latestPrice.dateFetched);
  const now = new Date();
  const diffInHours = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);

  return diffInHours >= 24; 
};
