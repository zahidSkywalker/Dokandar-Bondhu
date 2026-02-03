import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';

export const useDashboardStats = () => {
  // 1. Get today's range
  const todayStart = startOfDay(new Date()).getTime();
  const todayEnd = endOfDay(new Date()).getTime();

  // 2. Live queries for sales today
  const salesToday = useLiveQuery(
    () => db.sales
      .where('date')
      .between(todayStart, todayEnd, true, true)
      .toArray(),
    [todayStart, todayEnd]
  );

  // 3. Live queries for expenses today
  const expensesToday = useLiveQuery(
    () => db.expenses
      .where('date')
      .between(todayStart, todayEnd, true, true)
      .toArray(),
    [todayStart, todayEnd]
  );

  // 4. Live query for low stock items (Stock < 10)
  const lowStockItems = useLiveQuery(
    () => db.products
      .where('stock')
      .below(10)
      .toArray(),
    []
  );

  // 5. Calculate Daily Totals
  const totalSales = salesToday?.reduce((sum, sale) => sum + sale.total, 0) || 0;
  const totalProfit = salesToday?.reduce((sum, sale) => sum + sale.profit, 0) || 0;
  const totalExpense = expensesToday?.reduce((sum, exp) => sum + exp.amount, 0) || 0;

  // 6. Real Chart Data Generation (Last 7 Days)
  // We use a live query that depends on all sales (simplified for PWA scale)
  const allSales = useLiveQuery(() => db.sales.toArray(), []);

  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    const dayStart = startOfDay(d).getTime();
    const dayEnd = endOfDay(d).getTime();

    // Calculate actual sales for this specific day
    const daySales = allSales?.filter(s => s.date >= dayStart && s.date <= dayEnd) || [];
    const total = daySales.reduce((sum, s) => sum + s.total, 0);

    return {
      // Format date as Mon, Tue, Wed (or Bangla equivalent)
      date: format(d, 'EEE'),
      sales: total // REAL DATA
    };
  });

  return {
    totalSales,
    totalProfit,
    totalExpense,
    netProfit: totalProfit - totalExpense,
    lowStockCount: lowStockItems?.length || 0,
    isLoading: !salesToday || !expensesToday || !lowStockItems || !allSales,
    recentSales: salesToday?.sort((a, b) => b.date - a.date).slice(0, 5) || [],
    chartData // Export the real chart data
  };
};
