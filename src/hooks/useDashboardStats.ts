import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';

export const useDashboardStats = () => {
  const todayStart = startOfDay(new Date()).getTime();
  const todayEnd = endOfDay(new Date()).getTime();

  const salesToday = useLiveQuery(
    () => db.sales
      .where('date')
      .between(todayStart, todayEnd, true, true)
      .toArray(),
    [todayStart, todayEnd]
  );

  const expensesToday = useLiveQuery(
    () => db.expenses
      .where('date')
      .between(todayStart, todayEnd, true, true)
      .toArray(),
    [todayStart, todayEnd]
  );

  const lowStockItems = useLiveQuery(
    () => db.products
      .where('stock')
      .below(10)
      .toArray(),
    []
  );

  const allSales = useLiveQuery(() => db.sales.toArray(), []);

  const totalSales = salesToday?.reduce((sum, sale) => sum + sale.total, 0) || 0;
  const totalProfit = salesToday?.reduce((sum, sale) => sum + sale.profit, 0) || 0;
  const totalExpense = expensesToday?.reduce((sum, exp) => sum + exp.amount, 0) || 0;

  // FIX: Ensure comparison is always number vs number
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    const dayStart = startOfDay(d).getTime();
    const dayEnd = endOfDay(d).getTime();

    const daySales = allSales?.filter(s => {
      const saleTime = new Date(s.date).getTime(); // Convert to number
      return saleTime >= dayStart && saleTime <= dayEnd;
    }) || [];
    
    const total = daySales.reduce((sum, s) => sum + s.total, 0);

    return {
      date: format(d, 'EEE'),
      sales: total
    };
  });

  return {
    totalSales,
    totalProfit,
    totalExpense,
    netProfit: totalProfit - totalExpense,
    lowStockCount: lowStockItems?.length || 0,
    isLoading: !salesToday || !expensesToday || !lowStockItems || !allSales,
    recentSales: salesToday?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5) || [],
    chartData
  };
};
