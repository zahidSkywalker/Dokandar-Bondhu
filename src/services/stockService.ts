import { db } from '../db/db';
import { StockPrediction } from '../types';

export const calculateDailyAverage = async (productId: number, days: number = 7): Promise<number> => {
  const sevenDaysAgo = Date.now() - (days * 24 * 60 * 60 * 1000);
  
  const sales = await db.sales
    .where('productId')
    .equals(productId)
    .and('date')
    .above(sevenDaysAgo)
    .toArray();

  if (sales.length === 0) return 0;

  const totalQtySold = sales.reduce((sum, s) => sum + s.quantity, 0);
  return totalQtySold / days;
};

export const updateStockPredictions = async (): Promise<void> => {
  const products = await db.products.toArray();
  
  const predictions: StockPrediction[] = [];

  for (const product of products) {
    // 1. Calculate Daily Average
    const avgDailySales = await calculateDailyAverage(product.id!, 7);
    
    // 2. Calculate Days Left
    let daysLeft = 999; // Infinite
    if (avgDailySales > 0) {
      daysLeft = Math.floor(product.stock / avgDailySales);
    }

    // 3. Determine Alert Level
    let alertLevel: 'normal';
    if (daysLeft <= 2) alertLevel = 'critical';
    else if (daysLeft <= 5) alertLevel = 'warning';

    predictions.push({
      productId: product.id!,
      productName: product.name,
      currentStock: product.stock,
      daysLeft,
      avgDailySales,
      alertLevel
    });
  }

  // 4. Save to DB
  await db.stockPredictions.clear();
  await db.stockPredictions.bulkPut(predictions);
};
