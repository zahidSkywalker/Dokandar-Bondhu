import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { startOfDay, endOfDay, subDays, format, startOfMonth, endOfMonth } from 'date-fns';
import { getGreeting } from '../lib/utils';

export const useDashboardStats = () => {
  // --- Ranges (Computed inside the hook to ensure freshness) ---
  const now = new Date();
  const todayStart = startOfDay(now).getTime();
  const todayEnd = endOfDay(now).getTime();
  const monthStart = startOfMonth(now).getTime();
  const monthEnd = endOfMonth(now).getTime();
  const sevenDaysAgo = subDays(now, 7).getTime();
  
  // Yesterday Ranges
  const yesterdayStart = startOfDay(subDays(now, 1)).getTime();
  const yesterdayEnd = endOfDay(subDays(now, 1)).getTime();

  // --- Queries ---

  // Today - Querying by Date Object or Number? 
  // Dexie handles Date objects, but explicit numbers are safer for comparison.
  // We assume 'date' is stored as Date object in DB.
  
  const salesToday = useLiveQuery(() => 
    db.sales
      .where('date')
      .between(new Date(todayStart), new Date(todayEnd), true, true)
      .toArray(), 
    [todayStart, todayEnd]
  );
  
  // Get ALL expenses for today (General + Inventory)
  const expensesTodayGeneral = useLiveQuery(() => 
    db.expenses
      .where('date')
      .between(new Date(todayStart), new Date(todayEnd), true, true)
      .toArray(), 
    [todayStart, todayEnd]
  );

  const expensesTodayInventory = useLiveQuery(() => 
    db.inventoryExpenses
      .where('date')
      .between(new Date(todayStart), new Date(todayEnd), true, true)
      .toArray(), 
    [todayStart, todayEnd]
  );
  
  // Yesterday
  const salesYesterday = useLiveQuery(() => 
    db.sales
      .where('date')
      .between(new Date(yesterdayStart), new Date(yesterdayEnd), true, true)
      .toArray(), 
    [yesterdayStart, yesterdayEnd]
  );

  // Month
  const salesMonth = useLiveQuery(() => 
    db.sales
      .where('date')
      .between(new Date(monthStart), new Date(monthEnd), true, true)
      .toArray(), 
    [monthStart, monthEnd]
  );
  
  const expensesMonthGeneral = useLiveQuery(() => 
    db.expenses
      .where('date')
      .between(new Date(monthStart), new Date(monthEnd), true, true)
      .toArray(), 
    [monthStart, monthEnd]
  );
  
  const expensesMonthInventory = useLiveQuery(() => 
    db.inventoryExpenses
      .where('date')
      .between(new Date(monthStart), new Date(monthEnd), true, true)
      .toArray(), 
    [monthStart, monthEnd]
  );

  // General
  const lowStockItems = useLiveQuery(() => db.products.where('stock').below(10).toArray(), []);
  const allSales = useLiveQuery(() => db.sales.toArray(), []);
  const allCustomers = useLiveQuery(() => db.customers.toArray(), []);
  const allProducts = useLiveQuery(() => db.products.toArray(), []);

  // --- Calculations ---

  // Daily Stats
  const totalSales = salesToday?.reduce((sum, sale) => sum + sale.total, 0) || 0;
  const totalProfit = salesToday?.reduce((sum, sale) => sum + sale.profit, 0) || 0;
  
  // Fix: Combine General + Inventory expenses for "Today's Expenses"
  const totalGeneralExpenseToday = expensesTodayGeneral?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
  const totalInventoryExpenseToday = expensesTodayInventory?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
  const totalExpense = totalGeneralExpenseToday + totalInventoryExpenseToday;

  // Net Profit Logic: 
  // Gross Profit (from sales) minus General Expenses. 
  // (Inventory expense is usually considered Cost of Goods Sold, already accounted for in Gross Profit calculation usually, 
  // but here Gross Profit = Sell - Buy. So Net = Gross - OpEx)
  const netProfit = totalProfit - totalGeneralExpenseToday;

  // Monthly Stats
  const totalSalesMonth = salesMonth?.reduce((sum, s) => sum + s.total, 0) || 0;
  const totalProfitMonth = salesMonth?.reduce((sum, s) => sum + s.profit, 0) || 0;
  
  const totalGeneralExpenseMonth = expensesMonthGeneral?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
  const totalInventoryExpenseMonth = expensesMonthInventory?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
  
  // Baki Khata Total
  const totalDebt = allCustomers?.reduce((sum, c) => sum + c.debt, 0) || 0;

  // Yesterday Sales & Growth
  const totalSalesYesterday = salesYesterday?.reduce((sum, s) => sum + s.total, 0) || 0;
  const salesGrowth = totalSalesYesterday > 0 
    ? ((totalSales - totalSalesYesterday) / totalSalesYesterday) * 100 
    : (totalSales > 0 ? 100 : 0);

  // --- Profit Insights (Last 30 Days) ---
  let profitInsights: { top5: any[], bottom5: any[] } | null = null;
  const thirtyDaysAgo = subDays(now, 30).getTime();
  const recentSales = allSales?.filter(s => new Date(s.date).getTime() >= thirtyDaysAgo) || [];

  if (recentSales.length > 0) {
    const productStats = new Map<number, { name: string; totalProfit: number; totalSales: number }>();
    recentSales.forEach(sale => {
      const current = productStats.get(sale.productId) || { name: sale.productName, totalProfit: 0, totalSales: 0 };
      current.totalProfit += sale.profit;
      current.totalSales += sale.total;
      productStats.set(sale.productId, current);
    });

    const sortedProducts = Array.from(productStats.values())
      .sort((a, b) => b.totalProfit - a.totalProfit);

    profitInsights = {
      top5: sortedProducts.slice(0, 5),
      bottom5: sortedProducts.slice(-5).reverse()
    };
  }

  // --- Stock Prediction Logic ---
  let stockPredictions: any[] = [];
  
  if (allProducts && allSales) {
    const salesForPrediction = allSales.filter(s => {
      const saleTime = new Date(s.date).getTime();
      return saleTime >= sevenDaysAgo;
    });

    const groupedSales = salesForPrediction.reduce((acc, sale) => {
      acc[sale.productId] = (acc[sale.productId] || 0) + sale.quantity;
      return acc;
    }, {} as Record<number, number>);

    stockPredictions = allProducts.map(product => {
      const weeklySold = groupedSales[product.id!] || 0;
      const dailyAvg = weeklySold / 7;
      const daysLeft = dailyAvg > 0 ? Math.floor(product.stock / dailyAvg) : 999;
      return { ...product, daysLeft, dailyAvg };
    });
  }

  // --- Chart Data ---
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(now, 6 - i);
    const dayStart = startOfDay(d).getTime();
    const dayEnd = endOfDay(d).getTime();
    
    const daySales = allSales?.filter(s => {
      const saleTime = new Date(s.date).getTime();
      return saleTime >= dayStart && saleTime <= dayEnd;
    }) || [];
    
    return { 
      date: format(d, 'EEE'), 
      sales: daySales.reduce((sum, s) => sum + s.total, 0) 
    };
  });

  return {
    // Daily Stats
    totalSales,
    totalProfit,
    totalExpense,
    netProfit, // Return calculated net profit
    lowStockCount: lowStockItems?.length || 0,
    recentSales: salesToday?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5) || [],
    
    // Monthly Stats
    totalInventoryExpenseMonth,
    totalGeneralExpenseMonth,
    totalSalesMonth,
    totalProfitMonth,
    netMonthlyProfit: totalProfitMonth - totalGeneralExpenseMonth,

    // Others
    totalDebt,
    stockPredictions, 
    isLoading: !salesToday || !expensesTodayGeneral || !lowStockItems || !allSales || !allProducts,
    chartData,
    greeting: getGreeting(),
    
    // Growth
    salesGrowth,
    profitInsights,
    totalSalesYesterday
  };
};
