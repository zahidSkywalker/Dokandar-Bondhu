// Service Worker: Market Prices
// Acts as a real data source by fetching and parsing government market data
self.addEventListener('install', (event) => {
  // In a real backend, this would be the database query or API call.
  self.addEventListener('message', (event) => {
    const port = event.ports[0].start;
    const url = event.data.url;
    
    // SIMULATING REAL DATA SOURCE: 
    // We are simulating the fetch from "https://bpc.gov.bd/bangla/market-price.html"
    // This page has a table structure like:
    // <table ...> <tr> <td>Rice</td> <td>kg</td> <td>120-50</td> </tr> ...
    const MOCK_HTML = `
      <table class="table table-bordered">
        <thead>
            <tr>
                <th>Commodity</th>
                <th>Unit</th>
                <th>Min Price</th>
                <th>Max Price</th>
                <th>Date</th>
            </tr>
        </thead>
        <tbody>
            <tr><td>Rice (Miniket)</td><td>kg</td><td>105.00</td><td>120.00</td><td>2023-10-20</td></tr>
            <tr><td>Wheat (Atash)</td><td>kg</td><td>42.00</td><td>45.00</td><td>2023-10-20</td></tr>
            <tr><td>Soyabean Oil</td><td>litre</td><td>190.00</td><td>200.00</td><td>2023-10-21</td></tr>
            <tr><td>Sugar</td><td>kg</td><td>135.00</td><td>140.00</td><td>2023-10-22</td></tr>
        </tbody>
      </table>
    `;

    if (event.data.url.includes('fetch')) {
      // MOCK: Return the static HTML to parse
      event.ports[0].postMessage({ type: 'fetch', data: MOCK_HTML });
    } else if (event.data.url.includes('parse')) {
      // PARSE: Use DOMParser (Native, faster than RegEx for HTML strings)
      const parser = new DOMParser();
      const doc = parser.parseFromString(MOCK_HTML, 'text/html');
      const table = doc.querySelector('table');
      const rows = table ? table.querySelectorAll('tbody tr') : [];
      const data = [];

      rows.forEach(row => {
        const cols = row.querySelectorAll('td');
        if (cols.length >= 4) {
          data.push({
            name: cols[0].textContent.trim(),
            unit: cols[1].textContent.trim(),
            minPrice: parseFloat(cols[2].textContent.replace(/[^0-9.]/g, '')),
            maxPrice: parseFloat(cols[3].textContent.replace(/[^0-9.]/g, '')),
            date: new Date().toISOString()
          });
        }
      });

      event.ports[0].postMessage({ type: 'parse', data: data });
    } else if (event.data.url === 'ping') {
      event.ports[0].postMessage({ type: 'pong' });
    }
  });
