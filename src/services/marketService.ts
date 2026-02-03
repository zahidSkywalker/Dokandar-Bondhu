import { db } from '../db/db';
import { MarketPrice } from '../types';

// TCB Official Daily Price Page (Target URL)
// Note: Direct client-side scraping may face CORS restrictions. 
// In a production environment, you might need a CORS proxy if TCB blocks the request.
const TCB_PRICE_URL = 'https://tcb.gov.bd/site/view/daily-market-price';

// Helper to check network status
export const isOnline = (): boolean => navigator.onLine;

/**
 * Parses the HTML content from TCB to extract market data.
 * NOTE: This parser looks for standard table structures. 
 * If TCB changes their HTML layout, this logic needs updating.
 */
const parseTCBHtml = (htmlText: string): Omit<MarketPrice, 'id' | 'dateFetched'>[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, 'text/html');
  const rows = Array.from(doc.querySelectorAll('table tr')); // Select all table rows
  
  const prices: Omit<MarketPrice, 'id' | 'dateFetched'>[] = [];
  const today = new Date();

  // Skip header rows, start from index 1 typically. 
  // We rely on content detection to skip empty/headers.
  rows.forEach((row) => {
    const cells = Array.from(row.querySelectorAll('td'));
    if (cells.length < 3) return; // Not a data row

    // Extracting text and cleaning
    // Common TCB structure: Name | Variety/Type | Unit | Price Range
    const nameRaw = cells[0].innerText.trim();
    const unitRaw = cells[cells.length - 2]?.innerText.trim() || 'kg'; // Unit usually 2nd to last
    const priceRaw = cells[cells.length - 1]?.innerText.trim(); // Price usually last

    if (!nameRaw || nameRaw === 'Commodity' || nameRaw === 'পণ্যের নাম') return;

    // Parse Price Range (e.g., "120-130" or "১২০-১৩০")
    // Remove Bangla digits first for calculation
    const cleanPrice = priceRaw.replace(/[০-৯]/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);
    const priceMatch = cleanPrice.match(/(\d+)\s*[-–]\s*(\d+)/);

    if (priceMatch) {
      const minPrice = parseInt(priceMatch[1]);
      const maxPrice = parseInt(priceMatch[2]);

      // Determine Category (Simple heuristic)
      let category = 'essentials';
      const nameLower = nameRaw.toLowerCase();
      if (nameLower.includes('চাল') || nameLower.includes('rice') || nameLower.includes('গম')) category = 'rice';
      else if (nameLower.includes('সবজ') || nameLower.includes('vegetable') || nameLower.includes('বেগুন') || nameLower.includes('পেঁয়াজ')) category = 'vegetables';
      else if (nameLower.includes('মসলা') || nameLower.includes('spice') || nameLower.includes('রসুন')) category = 'spices';
      else if (nameLower.includes('মাছ') || nameLower.includes('fish') || nameLower.includes('মাংস') || nameLower.includes('meat')) category = 'meat';
      else if (nameLower.includes('ফল') || nameLower.includes('fruit')) category = 'fruits';

      prices.push({
        nameEn: nameRaw, // Ideally we map this later, for now we keep original text
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
 * Fetches data from TCB, parses it, and updates Dexie.
 */
export const syncMarketPrices = async (): Promise<{ success: boolean; count: number; message: string }> => {
  if (!isOnline()) {
    return { success: false, count: 0, message: 'No internet connection' };
  }

  try {
    // 1. Fetch
    const response = await fetch(TCB_PRICE_URL, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      // Note: Without a backend proxy, browser might block this due to CORS if TCB doesn't allow it.
      // If CORS fails, catch block handles it.
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const htmlText = await response.text();

    // 2. Parse
    const parsedData = parseTCBHtml(htmlText);

    if (parsedData.length === 0) {
      return { success: false, count: 0, message: 'No data found on source page.' };
    }

    // 3. Update Database (Clear old, add new)
    // We mark them with today's date
    const dataWithDate = parsedData.map(item => ({ ...item, dateFetched: new Date() }));

    await db.transaction('rw', db.marketPrices, async () => {
      await db.marketPrices.clear(); // Simple strategy: replace today's list
      await db.marketPrices.bulkAdd(dataWithDate);
    });

    return { success: true, count: parsedData.length, message: 'Updated successfully' };

  } catch (error) {
    console.error('Sync Error:', error);
    // Fallback for CORS issues or parsing errors
    return { 
      success: false, 
      count: 0, 
      message: error instanceof TypeError && error.message.includes('fetch') 
        ? 'Connection blocked by Browser (CORS) or Network.' 
        : 'Failed to parse data.' 
    };
  }
};

/**
 * Determines if a sync is needed (Last sync > 24 hours ago or no data exists)
 */
export const shouldSyncMarketPrices = async (): Promise<boolean> => {
  const latestPrice = await db.marketPrices.orderBy('dateFetched').last();
  
  if (!latestPrice) return true; // No data, sync needed

  const lastSync = new Date(latestPrice.dateFetched);
  const now = new Date();
  const diffInHours = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);

  return diffInHours >= 24; // Sync if 24 hours have passed
};
