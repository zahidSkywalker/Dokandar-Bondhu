import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { startOfDay, endOfDay, subDays, format, startOfMonth, endOfMonth } from 'date-fns';
import { getGreeting } from '../lib/utils';

export const useDashboardStats = () => {
  // --- Ranges (All defined as Numbers) ---
  const todayStart = startOfDay(new Date()).getTime();
  const todayEnd = endOfDay(new Date()).getTime();
  const monthStart = startOfMonth(new Date()).getTime();
  const monthEnd = endOfMonth(new Date()).getTime();
  const sevenDaysAgo = subDays(new Date(), 7).getTime();
  const stockPredictions = useLiveQuery(() => db.stockPredictions.toArray());
  // --- Queries ---

  // Today
  const salesToday = useLiveQuery(() => db.sales.where('date').between(todayStart, todayEnd, true, true).toArray(), [todayStart, todayEnd]);
  const expensesToday = useLiveQuery(() => db.expenses.where('date').between(todayStart, todayEnd, true, true).toArray(), [todayStart, todayEnd]);
  
  // Month (Required for Monthly Profit View)
  const salesMonth = useLiveQuery(() => db.sales.where('date').between(monthStart, monthEnd, true, true).toArray(), [monthStart, monthEnd]);
  const expensesMonth = useLiveQuery(() => db.expenses.where('date').between(monthStart, monthEnd, true, true).toArray(), [monthStart, monthEnd]);
  const inventoryExpensesMonth = useLiveQuery(() => db.inventoryExpenses.where('date').between(monthStart, monthEnd, true, true).toArray(), [monthStart, monthEnd]);

  // General & Prediction
  const lowStockItems = useLiveQuery(() => db.products.where('stock').below(10).toArray(), []);
  const allSales = useLiveQuery(() => db.sales.toArray(), []);
  const allCustomers = useLiveQuery(() => db.customers.toArray(), []);
  const allProducts = useLiveQuery(() => db.products.toArray(), []);

  // --- Calculations ---

  // Daily Stats
  const totalSales = salesToday?.reduce((sum, sale) => sum + sale.total, 0) || 0;
  const totalProfit = salesToday?.reduce((sum, sale) => sum + sale.profit, 0) || 0;
  const totalExpense = expensesToday?.reduce((sum, exp) => sum + exp.amount, 0) || 0;

  // Monthly Stats
  const totalInventoryExpenseMonth = inventoryExpensesMonth?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
  const totalExpenseMonth = expensesMonth?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
  const totalSalesMonth = salesMonth?.reduce((sum, s) => sum + s.total, 0) || 0;
  const totalProfitMonth = salesMonth?.reduce((sum, s) => sum + s.profit, 0) || 0;
  const netMonthlyProfit = totalProfitMonth - (totalExpenseMonth + totalInventoryExpenseMonth);

  // Baki Khata Total
  const totalDebt = allCustomers?.reduce((sum, c) => sum + c.debt, 0) || 0;

  // --- Stock Prediction Logic (FIXED: All comparisons use Timestamps) ---
  let stockPredictions: any[] = [];
  
  if (allProducts && allSales) {
    // 1. Filter sales to last 7 days (Converting s.date to Number to compare with sevenDaysAgo Number)
    const recentSales = allSales.filter(s => {
      const saleTime = new Date(s.date).getTime();
      return saleTime >= sevenDaysAgo;
    });

    // 2. Group by productId
    const groupedSales = recentSales.reduce((acc, sale) => {
      acc[sale.productId] = (acc[sale.productId] || 0) + sale.quantity;
      return acc;
    }, {} as Record<number, number>);

    // 3. Map products to prediction objects
    stockPredictions = allProducts.map(product => {
      const weeklySold = groupedSales[product.id!] || 0;
      const dailyAvg = weeklySold / 7;
      
      // Prevent division by zero
      const daysLeft = dailyAvg > 0 ? Math.floor(product.stock / dailyAvg) : 999;
      
      return { 
        ...product, 
        daysLeft, 
        dailyAvg 
      };
    });
  }

  // --- Chart Data ---
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    const dayStart = startOfDay(d).getTime();
    const dayEnd = endOfDay(d).getTime();
    
    // Filter sales for this day (Converting s.date to Number)
    const daySales = allSales?.filter(s => {
      const saleTime = new Date(s.date).getTime();
      return saleTime >= dayStart && saleTime <= dayEnd;
    }) || [];
    
    return { 
      date: format(d, 'EEE'), 
      sales: daySales.reduce((sum, s) => sum + s.total, 0) 
    };
  });
      // Stock Predictions Logic
  const stockPredictionsMap = stockPredictions 
    ? stockPredictions.reduce((acc, p) => ({ ...acc, [p.productId]: p }), {})
    : {};

  const predictionsWithDetails = (productId: number) => {
    const pred = stockPredictionsMap[productId];
    if (!pred) return null;
    return {
      ...pred,
      alertLevel: pred.alertLevel,
      daysLeftText: pred.daysLeft === 999 ? 'No Sales Data' : `${pred.daysLeft} Days Left`
    };
  };
  return {
    // Daily Stats
    totalSales,
    totalProfit,
    totalExpense,
    netProfit: totalProfit - totalExpense,
    lowStockCount: lowStockItems?.length || 0,
    recentSales: salesToday?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5) || [],
    
    // Monthly Stats
    totalInventoryExpenseMonth,
    totalExpenseMonth,
    totalSalesMonth,
    netMonthlyProfit,

    // Others
    totalDebt,
    stockPredictions, // Guaranteed Array
    isLoading: !salesToday || !expensesToday || !lowStockItems || !allSales || !allProducts,
    chartData,
    greeting: getGreeting()
  };
};
   // NEW: Return stock predictions mapped for easy access
    stockPredictions: products ? products.map(p => predictionsWithDetails(p.id!)) : [],
    isLoading: !stockPredictions
  };
};
