// api/market-prices.ts
export default async function handler(req: any, res: any) {
  // CORS Headers
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
    
    console.log("Fetching TCB..."); // Debug Log

    const response = await fetch(TCB_URL, {
      method: 'GET',
      // TCB might block if User-Agent looks too robotic
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    if (!response.ok) {
      throw new Error(`TCB Status: ${response.status}`);
    }

    let htmlText = await response.text();
    
    // FIX 1: Normalize HTML (Remove newlines and extra spaces)
    // TCB HTML often has newlines inside <td> tags which breaks Regex
    htmlText = htmlText.replace(/\n/g, ' ').replace(/\s+/g, ' ');
    
    // We only care about the table body to avoid huge string processing
    const tableBody = htmlText.match(/<tbody>(.*?)<\/tbody>/s)?.[1];
    
    if (!tableBody) {
      throw new Error("Could not find table body on TCB page.");
    }

    const rows = tableBody.split('<tr');
    const prices: any[] = [];

    // Skip header row (index 0) and loop data
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row.includes('<td')) continue;

      // FIX 2: Better Regex for extracting cells
      // It looks for <td ...> content </td>
      // Using global flag 'g' to find all occurrences
      const cellRegex = /<td[^>]*>(.*?)<\/td>/g;
      let match;
      const cellValues = [];

      while ((match = cellRegex.exec(row)) !== null) {
        cellValues.push(match[1]);
      }

      if (cellValues.length < 2) continue;

      const cleanText = (html: string) => html.replace(/<[^>]*>?/gm, '').trim();
      
      const nameRaw = cleanText(cellValues[0]);
      // Price is usually last column, Unit is second to last
      const priceRaw = cleanText(cellValues[cellValues.length - 1]);
      const unitRaw = cleanText(cellValues[cellValues.length - 2]) || 'kg';

      // Skip header/footer rows
      if (nameRaw === 'Commodity' || nameRaw === 'পণ্যের নাম' || nameRaw === '') continue;

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
    }

    if (prices.length === 0) {
      throw new Error("Parsed 0 prices from TCB page. Parser logic might need update.");
    }

    console.log(`Success: Parsed ${prices.length} items.`);

    res.status(200).json({ success: true, data: prices });

  } catch (error: any) {
    // FIX 3: Send the REAL error message back to frontend
    console.error("Server Error:", error.message); // This goes to Vercel Logs
    
    // Return the specific error message so we can debug in Frontend
    res.status(500).json({ 
      success: false, 
      error: error.message || "Unknown Error" 
    });
  }
}
