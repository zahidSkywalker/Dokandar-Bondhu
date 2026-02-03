export {};

self.onmessage = (event) => {
  if (event.data.type !== 'FETCH') return;

  const MOCK_DATA = [
    { name: 'Rice (Miniket)', unit: 'kg', minPrice: 105, maxPrice: 120 },
    { name: 'Wheat (Atash)', unit: 'kg', minPrice: 42, maxPrice: 45 },
    { name: 'Soyabean Oil', unit: 'litre', minPrice: 190, maxPrice: 200 },
    { name: 'Sugar', unit: 'kg', minPrice: 135, maxPrice: 140 }
  ];

  const payload = MOCK_DATA.map(item => ({
    ...item,
    date: new Date().toISOString()
  }));

  postMessage({ type: 'prices', payload });
};
