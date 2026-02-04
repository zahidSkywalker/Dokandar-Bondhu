import { db } from '../db/db';
import { MarketPrice } from '../types';

// TCB Official Daily Price Page
const TCB_TARGET_URL = 'https://tcb.gov.bd/site/view/daily-market-price';

// ==========================================
// FIX: Multiple Proxy List for Reliability
// If one fails, the app tries the next one automatically.
// ==========================================
const PROXY_LIST = [
  // Proxy 1: AllOrigins (Returns JSON wrapper, good for encoding)
  { url: 'https://api.allorigins.win/get?url=', type: 'json' },
  // Proxy 2: Corsproxy.io (Direct passthrough)
  { url: 'https://corsproxy.io/?', type: 'direct' },
  // Proxy 3: ThingProxy (Backup)
  { url: 'https://thingproxy.freeboard.io/fetch/', type: 'direct' }
];

// Helper to check network status
export const isOnline = (): boolean => navigator.onLine;

/**
 * Parses HTML content.
 */
const parseTCBHtml = (htmlText: string): Omit<MarketPrice, 'id' | 'dateFetched'>[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, 'text/html');
  const rows = Array.from(doc.querySelectorAll('table tr')); 
  
  const prices: Omit<MarketPrice, 'id' | 'dateFetched'>[] = [];

  rows.forEach((row) => {
    const cells = Array.from(row.querySelectorAll('td, th'));
    
    if (cells.length < 2) return; 

    // Cast to HTMLElement to access innerText
    const cellTexts = cells.map(c => (c as HTMLElement).innerText.trim()).filter(t => t !== '');

    if (cellTexts.length < 2) return;

    const nameRaw = cellTexts[0]; 
    const priceRaw = cellTexts[cellTexts.length - 1]; 
    const unitRaw = cellTexts[cellTexts.length - 2] || 'kg'; 

    // Skip headers
    if (nameRaw === 'Commodity' || nameRaw === 'পণ্যের নাম' || nameRaw === 'পণ্য') return;
    if (nameRaw.includes('তারিখ')) return; 

    // Safe Bangla Digit Conversion
    const banglaDigits = '০১২৩৪৫৬৭৮৯';
    const englishDigits = '0123456789';
    
    // Explicitly type parameter 'd' as string
    const cleanPrice = priceRaw.replace(/[০-৯]/g, (d: string) => {
      const index = banglaDigits.indexOf(d);
      return index !== -1 ? englishDigits[index] : d;
    });

    // Regex for Price
    const priceMatch = cleanPrice.match(/(\d+)\s*[-–]\s*(\d+)/) || cleanPrice.match(/(\d+)/);

    if (priceMatch) {
      const minPrice = parseInt(priceMatch[1]);
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

  console.log(`Parser found ${prices.length} items from HTML.`); 
  return prices;
};

/**
 * Main Sync Function with Multi-Proxy Fallback
 */
export const syncMarketPrices = async (): Promise<{ success: boolean; count: number; message: string }> => {
  if (!isOnline()) {
    return { success: false, count: 0, message: 'No internet connection' };
  }

  let lastError: any = null;

  // Try proxies one by one
  for (const proxy of PROXY_LIST) {
    try {
      const targetUrl = proxy.url + encodeURIComponent(TCB_TARGET_URL);
      
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
      });

      if (!response.ok) throw new Error(`Proxy (${proxy.url}) returned ${response.status}`);

      let htmlText = '';

      // Handle different proxy response types
      if (proxy.type === 'json') {
        const jsonData = await response.json();
        htmlText = jsonData.contents; // AllOrigins wraps content in "contents"
      } else {
        htmlText = await response.text();
      }

      // Validate that we got actual TCB content (and not an error page)
      if (!htmlText.includes('পণ্যের নাম') && !htmlText.includes('Commodity')) {
        throw new Error('Proxy returned invalid TCB page.');
      }
      
      console.log(`Success using Proxy: ${proxy.url}`);

      const parsedData = parseTCBHtml(htmlText);

      if (parsedData.length === 0) {
        throw new Error('Parsing failed or TCB page empty.');
      }

      // Update Database
      const dataWithDate = parsedData.map(item => ({ ...item, dateFetched: new Date() }));

      await db.transaction('rw', db.marketPrices, async () => {
        await db.marketPrices.clear();
        await db.marketPrices.bulkAdd(dataWithDate);
      });

      return { success: true, count: parsedData.length, message: 'Updated successfully' };

    } catch (error) {
      console.error(`Failed with proxy ${proxy.url}:`, error);
      lastError = error;
      // Continue to next proxy in the list
    }
  }

  // If all proxies failed
  return { 
    success: false, 
    count: 0, 
    message: 'All connection attempts failed. TCB site might be blocking proxies or down.' 
  };
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
