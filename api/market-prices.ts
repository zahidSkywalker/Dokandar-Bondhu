// api/market-prices.ts
// This code runs on the Vercel Server (Node.js environment)

export default async function handler(req: any, res: any) {
  // Allow CORS for your PWA
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const TCB_URL = 'https://tcb.gov.bd/site/view/daily-market-price';
    
    // 1. Fetch from TCB (Direct connection, no proxy needed on server)
    const response = await fetch(TCB_URL, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch from TCB' });
    }

    const htmlText = await response.text();

    // 2. Parse Logic (Same logic we used in frontend, but now on server)
    // We need to import Cheerio or use native DOMParser?
    // Since we are on Node.js, we can't use 'DOMParser'.
    // We should use 'cheerio' or simple Regex for now to keep it zero-dependency?
    // Let's use Regex to be simple and fast without installing new libs.
    
    const rows = htmlText.split('<tr');
    const prices: any[] = [];

    rows.forEach((row) => {
      if (!row.includes('<td')) return;

      // Extract cell content using Regex (Simple scraper)
      const cellMatches = row.match(/<td[^>]*>(.*?)<\/td>/gs);
      if (!cellMatches || cellMatches.length < 2) return;

      const cleanText = (html: string) => html.replace(/<[^>]*>?/gm, '').trim();
      
      const nameRaw = cleanText(cellMatches[0]);
      const priceRaw = cleanText(cellMatches[cellMatches.length - 1]);
      const unitRaw = cleanText(cellMatches[cellMatches.length - 2]) || 'kg';

      // Skip headers
      if (nameRaw === 'Commodity' || nameRaw === 'পণ্যের নাম') return;

      // Bangla Digit Conversion
      const banglaDigits = '০১২৩৪৫৬৭৮৯';
      const englishDigits = '0123456789';
      const cleanPrice = priceRaw.replace(/[০-৯]/g, (d: string) => {
        const index = banglaDigits.indexOf(d);
        return index !== -1 ? englishDigits[index] : d;
      });

      const priceMatch = cleanPrice.match(/(\d+)\s*[-–]\s*(\d+)/) || cleanPrice.match(/(\d+)/);

      if (priceMatch) {
        const minPrice = parseInt(priceMatch[1]);
        const maxPrice = priceMatch[2] ? parseInt(priceMatch[2]) : minPrice;

        prices.push({
          nameEn: nameRaw,
          nameBn: nameRaw,
          unit: unitRaw,
          minPrice,
          maxPrice,
          dateFetched: new Date().toISOString()
        });
      }
    });

    // 3. Return Data
    res.status(200).json({ success: true, data: prices });

  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
