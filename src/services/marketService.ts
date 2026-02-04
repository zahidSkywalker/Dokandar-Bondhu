import { db } from '../db/db';
import { MarketPrice } from '../types';

// TCB Official Daily Price Page
const TCB_TARGET_URL = 'https://tcb.gov.bd/site/view/daily-market-price';

// ==========================================
// FIX 1: Better CORS Proxy for encoding support
// ==========================================
const PROXY_URL = 'https://corsproxy.io/?';

// Helper to check network status
export const isOnline = (): boolean => navigator.onLine;

/**
 * Parses HTML content.
 * STRATEGY: First non-empty column = Name, Last non-empty column = Price.
 */
const parseTCBHtml = (htmlText: string): Omit<MarketPrice, 'id' | 'dateFetched'>[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, 'text/html');
  const rows = Array.from(doc.querySelectorAll('table tr')); 
  
  const prices: Omit<MarketPrice, 'id' | 'dateFetched'>[] = [];

  rows.forEach((row) => {
    // FIX 2: Select both TD (data) and TH (headers) just in case
    const cells = Array.from(row.querySelectorAll('td, th'));
    
    if (cells.length < 2) return; // Skip empty rows

    // Clean text from cells
    const cellTexts = cells.map(c => c.innerText.trim()).filter(t => t !== '');

    if (cellTexts.length < 2) return;

    const nameRaw = cellTexts[0]; // First column is always Name
    const priceRaw = cellTexts[cellTexts.length - 1]; // Last column is always Price
    const unitRaw = cellTexts[cellTexts.length - 2] || 'kg'; // Second to last is usually Unit

    // Skip headers
    if (nameRaw === 'Commodity' || nameRaw === 'পণ্যের নাম' || nameRaw === 'পণ্য') return;
    if (nameRaw.includes('তারিখ')) return; // Skip date rows if any

    // Safe Bangla Digit Conversion
    const banglaDigits = '০১২৩৪৫৬৭৮৯';
    const englishDigits = '0123456789';
    
    const cleanPrice = priceRaw.replace(/[০-৯]/g, (d) => {
      const index = banglaDigits.indexOf(d);
      return index !== -1 ? englishDigits[index] : d;
    });

    // FIX 3: Better Regex for Price (handles "120" or "120-130" or "120-125" or ranges)
    const priceMatch = cleanPrice.match(/(\d+)\s*[-–]\s*(\d+)/) || cleanPrice.match(/(\d+)/);

    if (priceMatch) {
      const minPrice = parseInt(priceMatch[1]);
      // If there is a range, take the second part, else just the single price
      const maxPrice = priceMatch[2] ? parseInt(priceMatch[2]) : minPrice;

      // Determine Category
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

  console.log(`Parser found ${prices.length} items from HTML.`); // Debug log
  return prices;
};

/**
 * Main Sync Function
 */
export const syncMarketPrices = async (): Promise<{ success: boolean; count: number; message: string }> => {
  if (!isOnline()) {
    return { success: false, count: 0, message: 'No internet connection' };
  }

  try {
    // Fetch using the robust proxy
    const response = await fetch(PROXY_URL + encodeURIComponent(TCB_TARGET_URL), {
      method: 'GET',
      // Headers are handled by the proxy, but we can try to send generic ones
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
    });

    if (!response.ok) throw new Error('Proxy network response was not ok');

    const htmlText = await response.text();
    
    console.log("HTML Length fetched:", htmlText.length); // Debug: Check if we got data

    const parsedData = parseTCBHtml(htmlText);

    if (parsedData.length === 0) {
      console.error("Parsing failed: 0 items found.");
      return { success: false, count: 0, message: 'Could not read data. TCB page structure might have changed.' };
    }

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
      message: 'Connection failed. Please try again.' 
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
