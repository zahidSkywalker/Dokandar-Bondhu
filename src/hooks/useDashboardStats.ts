import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { startOfDay, endOfDay, subDays, format, startOfMonth, endOfMonth } from 'date-fns';
import { getGreeting } from '../lib/utils';

export const useDashboardStats = () => {
  // Today
  const todayStart = startOfDay(new Date()).getTime();
  const todayEnd = endOfDay(new Date()).getTime();

  // Month
  const monthStart = startOfMonth(new Date()).getTime();
  const monthEnd = endOfMonth(new Date()).getTime();

  // Today's Queries
  const salesToday = useLiveQuery(() => db.sales.where('date').between(todayStart, todayEnd, true, true).toArray(), [todayStart, todayEnd]);
  const expensesToday = useLiveQuery(() => db.expenses.where('date').between(todayStart, todayEnd, true, true).toArray(), [todayStart, todayEnd]);
  const inventoryExpensesMonth = useLiveQuery(() => db.inventoryExpenses.where('date').between(monthStart, monthEnd, true, true).toArray(), [monthStart, monthEnd]);

  // General Stats
  const lowStockItems = useLiveQuery(() => db.products.where('stock').below(10).toArray(), []);
  const allSales = useLiveQuery(() => db.sales.toArray(), []);
  const allCustomers = useLiveQuery(() => db.customers.toArray(), []);

  // Monthly Stats for Chart
  const salesMonth = useLiveQuery(() => db.sales.where('date').between(monthStart, monthEnd, true, true).toArray(), [monthStart, monthEnd]);
  const expensesMonth = useLiveQuery(() => db.expenses.where('date').between(monthStart, monthEnd, true, true).toArray(), [monthStart, monthEnd]);

  // 1. Daily Calculations
  const totalSales = salesToday?.reduce((sum, sale) => sum + sale.total, 0) || 0;
  const totalProfit = salesToday?.reduce((sum, sale) => sum + sale.profit, 0) || 0;
  const totalExpense = expensesToday?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
  
  // 2. Monthly Calculations (Inventory + General Expenses)
  const totalInventoryExpenseMonth = inventoryExpensesMonth?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
  const totalExpenseMonth = expensesMonth?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
  const totalSalesMonth = salesMonth?.reduce((sum, s) => sum + s.total, 0) || 0;
  const totalProfitMonth = salesMonth?.reduce((sum, s) => sum + s.profit, 0) || 0;
  
  // Total Monthly Profit = Sales Profit - (General Expenses + Inventory Expenses)
  // Note: Usually Inventory Expense is Capital Expenditure, not deducted from Operating Profit, but user requested it tracked.
  // I will calculate Net Monthly Profit based on Daily Sales Profit vs All Expenses.
  const netMonthlyProfit = totalProfitMonth - (totalExpenseMonth + totalInventoryExpenseMonth);

  // 3. Stock Prediction
  // Calculate average daily sales per product over last 7 days
  const stockPredictions = allSales ? (() => {
    const predictions: any[] = [];
    const sevenDaysAgo = subDays(new Date(), 7).getTime();
    const recentSales = allSales.filter(s => s.date >= sevenDaysAgo);

    // Group by product
    const grouped = recentSales.reduce((acc, sale) => {
      acc[sale.productId] = (acc[sale.productId] || 0) + sale.quantity;
      return acc;
    }, {} as Record<number, number>);

    // Predict days left
    return db.products.toArray().then(products => {
      return products.map(p => {
        const weeklySold = grouped[p.id!] || 0;
        const dailyAvg = weeklySold / 7;
        const daysLeft = dailyAvg > 0 ? Math.floor(p.stock / dailyAvg) : 999;
        return { ...p, daysLeft, dailyAvg };
      });
    });
  })() : Promise.resolve([]);

  // 4. Chart Data (Weekly Sales)
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    const dayStart = startOfDay(d).getTime();
    const dayEnd = endOfDay(d).getTime();
    const daySales = allSales?.filter(s => {
      const saleTime = new Date(s.date).getTime();
      return saleTime >= dayStart && saleTime <= dayEnd;
    }) || [];
    return { date: format(d, 'EEE'), sales: daySales.reduce((sum, s) => sum + s.total, 0) };
  });

  return {
    totalSales,
    totalProfit,
    totalExpense,
    netProfit: totalProfit - totalExpense,
    lowStockCount: lowStockItems?.length || 0,
    totalDebt: allCustomers?.reduce((sum, c) => sum + c.debt, 0) || 0, // Total Baki Khata
    
    // Monthly Data
    totalInventoryExpenseMonth,
    totalExpenseMonth,
    totalSalesMonth,
    netMonthlyProfit,

    stockPredictions,
    
    isLoading: !salesToday || !expensesToday || !lowStockItems || !allSales,
    recentSales: salesToday?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5) || [],
    chartData,
    greeting: getGreeting()
  };
};
