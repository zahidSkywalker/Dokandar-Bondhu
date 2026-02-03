import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { startOfDay, endOfDay, subDays, format, startOfMonth, endOfMonth } from 'date-fns';
import { getGreeting } from '../lib/utils';

export const useDashboardStats = () => {
  // --- Ranges (Using Numbers for comparisons) ---
  const todayStart = startOfDay(new Date()).getTime();
  const todayEnd = endOfDay(new Date()).getTime();

  // Month Ranges
  const monthStart = startOfMonth(new Date()).getTime();
  const monthEnd = endOfMonth(new Date()).getTime();

  // --- Queries ---
  
  // Today
  const salesToday = useLiveQuery(() => db.sales.where('date').between(todayStart, todayEnd, true, true).toArray(), [todayStart, todayEnd]);
  const expensesToday = useLiveQuery(() => db.expenses.where('date').between(todayStart, todayEnd, true, true).toArray(), [todayStart, todayEnd]);
  
  // Month (Required for Monthly Profit View)
  const salesMonth = useLiveQuery(() => db.sales.where('date').between(monthStart, monthEnd, true, true).toArray(), [monthStart, monthEnd]);
  const expensesMonth = useLiveQuery(() => db.expenses.where('date').between(monthStart, monthEnd, true, true).toArray(), [monthStart, monthEnd]);
  const inventoryExpensesMonth = useLiveQuery(() => db.inventoryExpenses.where('date').between(monthStart, monthEnd, true, true).toArray(), [monthStart, monthEnd]);

  // General
  const lowStockItems = useLiveQuery(() => db.products.where('stock').below(10).toArray(), []);
  const allSales = useLiveQuery(() => db.sales.toArray(), []);
  const allCustomers = useLiveQuery(() => db.customers.toArray(), []);

  // --- Calculations ---

  // Daily
  const totalSales = salesToday?.reduce((sum, sale) => sum + sale.total, 0) || 0;
  const totalProfit = salesToday?.reduce((sum, sale) => sum + sale.profit, 0) || 0;
  const totalExpense = expensesToday?.reduce((sum, exp) => sum + exp.amount, 0) || 0;

  // Monthly (Required Variables)
  const totalInventoryExpenseMonth = inventoryExpensesMonth?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
  const totalExpenseMonth = expensesMonth?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
  const totalSalesMonth = salesMonth?.reduce((sum, s) => sum + s.total, 0) || 0;
  const totalProfitMonth = salesMonth?.reduce((sum, s) => sum + s.profit, 0) || 0;
  
  // Net Monthly Profit = (Sales Profit) - (General Expenses + Inventory Expenses)
  const netMonthlyProfit = totalProfitMonth - (totalExpenseMonth + totalInventoryExpenseMonth);

  // Baki Khata Total
  const totalDebt = allCustomers?.reduce((sum, c) => sum + c.debt, 0) || 0;

  // Stock Prediction
  const stockPredictions = allSales ? (() => {
    const predictions: any[] = [];
    const sevenDaysAgo = subDays(new Date(), 7).getTime();
    const recentSales = allSales.filter(s => {
      const saleTime = new Date(s.date).getTime();
      return saleTime >= sevenDaysAgo;
    });

    const grouped = recentSales.reduce((acc, sale) => {
      acc[sale.productId] = (acc[sale.productId] || 0) + sale.quantity;
      return acc;
    }, {} as Record<number, number>);

    return db.products.toArray().then(products => {
      return products.map(p => {
        const weeklySold = grouped[p.id!] || 0;
        const dailyAvg = weeklySold / 7;
        const daysLeft = dailyAvg > 0 ? Math.floor(p.stock / dailyAvg) : 999;
        return { ...p, daysLeft, dailyAvg };
      });
    });
  })() : Promise.resolve([]);

  // Chart Data
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    const dayStart = startOfDay(d).getTime();
    const dayEnd = endOfDay(d).getTime();
    
    const daySales = allSales?.filter(s => {
      // Fix Date comparison error: ensure both are Numbers
      const saleTime = new Date(s.date).getTime();
      return saleTime >= dayStart && saleTime <= dayEnd;
    }) || [];
    
    return { date: format(d, 'EEE'), sales: daySales.reduce((sum, s) => sum + s.total, 0) };
  });

  return {
    // Daily Stats
    totalSales,
    totalProfit,
    totalExpense,
    netProfit: totalProfit - totalExpense,
    lowStockCount: lowStockItems?.length || 0,
    recentSales: salesToday?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5) || [],
    
    // Monthly Stats (FIXED: All present)
    totalInventoryExpenseMonth,
    totalExpenseMonth,
    totalSalesMonth,
    netMonthlyProfit,

    // Others
    totalDebt,
    stockPredictions,
    isLoading: !salesToday || !expensesToday || !lowStockItems || !allSales,
    chartData,
    greeting: getGreeting()
  };
};
