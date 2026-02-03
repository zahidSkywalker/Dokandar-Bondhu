import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { startOfDay, endOfDay } from 'date-fns';

export const useDashboardStats = () => {
  // Get today's range
  const todayStart = startOfDay(new Date()).getTime();
  const todayEnd = endOfDay(new Date()).getTime();

  // Live queries for sales today
  const salesToday = useLiveQuery(
    () => db.sales
      .where('date')
      .between(todayStart, todayEnd, true, true)
      .toArray(),
    [todayStart, todayEnd]
  );

  // Live queries for expenses today
  const expensesToday = useLiveQuery(
    () => db.expenses
      .where('date')
      .between(todayStart, todayEnd, true, true)
      .toArray(),
    [todayStart, todayEnd]
  );

  // Live query for low stock items (Stock < 10)
  const lowStockItems = useLiveQuery(
    () => db.products
      .where('stock')
      .below(10)
      .toArray(),
    []
  );

  // Calculate Totals
  const totalSales = salesToday?.reduce((sum, sale) => sum + sale.total, 0) || 0;
  const totalProfit = salesToday?.reduce((sum, sale) => sum + sale.profit, 0) || 0;
  const totalExpense = expensesToday?.reduce((sum, exp) => sum + exp.amount, 0) || 0;

  return {
    totalSales,
    totalProfit,
    totalExpense,
    netProfit: totalProfit - totalExpense,
    lowStockCount: lowStockItems?.length || 0,
    isLoading: !salesToday || !expensesToday || !lowStockItems,
    recentSales: salesToday?.sort((a, b) => b.date - a.date).slice(0, 5) || []
  };
};
