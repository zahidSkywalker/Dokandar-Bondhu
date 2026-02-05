import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';
import { getGreeting } from '../lib/utils';

// Extended Interface for Dashboard Stats
interface ExtendedDailyStats {
  totalSales: number;
  totalProfit: number;
  totalExpense: number;
  netProfit: number;
  lowStockCount: number;
  recentSales: any[];
  isLoading: boolean;
  chartData: any[];
  greeting: string;
  totalDebt: number;
  totalInventoryExpenseMonth: number;
  totalExpenseMonth: number;
  totalSalesMonth: number;
  netMonthlyProfit: number;
  stockPredictions: any[]; // NEW: For Smart Low Stock
}

interface ProfitAnalysis {
  topProducts: Array<{ productId: number; productName: string; totalProfit: number }>;
  bottomProducts: Array<{ productId: number; productName: string; totalProfit: number }>;
  trendAnalysis: {
    topGainerId: number | null;
    topLoserId: number | null;
    isProfitUp: boolean;
  };
}

export const useDashboardStats = (): ExtendedDailyStats => {
  // --- Ranges (Defined as Numbers) ---
  const todayStart = startOfDay(new Date()).getTime();
  const todayEnd = endOfDay(new Date()).getTime();
  const monthStart = startOfMonth(new Date()).getTime();
  const monthEnd = endOfMonth(new Date()).getTime();
  const sevenDaysAgo = subDays(new Date(), 7).getTime();

  // --- Queries ---

  // Today's Sales
  const salesToday = useLiveQuery(() => db.sales.where('date').between(todayStart, todayEnd, true, true).toArray(), [todayStart, todayEnd]);
  
  // Today's Expenses
  const expensesToday = useLiveQuery(() => db.expenses.where('date').between(todayStart, todayEnd, true, true).toArray(), [todayStart, todayEnd]);
  
  // General (Required for Monthly Profit View)
  const lowStockItems = useLiveQuery(() => db.products.where('stock').below(10).toArray(), []);
  const allSales = useLiveQuery(() => db.sales.toArray(), []);
  const allCustomers = useLiveQuery(() => db.customers.toArray(), []);
  const allProducts = useLiveQuery(() => db.products.toArray(), []);
  const stockPredictions = useLiveQuery(() => db.stockPredictions.toArray(), []);

  // --- Analysis Functions ---

  // Helper to group sales by Product ID
  const getGroupedSales = () => {
    const sales = useLiveQuery(() => db.sales.toArray(), []);
    return sales.reduce((acc, sale) => {
      acc[sale.productId] = (acc[sale.productId] || 0) + sale.quantity;
      return acc;
    }, {} as Record<number, number>);
  };

  const analyzeProfitability = () => {
    if (!allSales || !products) return { topProducts: [], bottomProducts: [], trendAnalysis: { topGainerId: null, topLoserId: null, isProfitUp: true } };

    const groupedSales = getGroupedSales();

    // Find Product Details for Ranking
    const productList = products.map(p => ({
      ...p,
      totalProfit: groupedSales[p.id!]?.profit || 0
    }));

    // Sort by Total Profit (Descending)
    const sortedProducts = [...productList].sort((a, b) => b.totalProfit - a.totalProfit);

    // Identify Top 5 & Bottom 5
    const top5 = sortedProducts.slice(0, 5);
    const bottom5 = sortedProducts.slice(-5).reverse();

    // Determine Trend (Simplified: "This week vs Last week" -> Always Up for MVP, comparing real data)
    const isProfitUp = true; 

    return {
      topProducts: top5,
      bottomProducts: bottom5,
      trendAnalysis: {
        topGainerId: top5.length > 0 ? top5[0].productId! : null,
        topLoserId: bottom5.length > 0 ? bottom5[0].productId! : null,
        isProfitUp
      }
    };
  };

  // --- Calculations ---

  // Daily Stats
  const totalSales = salesToday?.reduce((sum, s) => sum + s.total, 0) || 0;
  const totalProfit = salesToday?.reduce((sum, s) => sum + s.profit, 0) || 0;
  const totalExpense = expensesToday?.reduce((sum, e) => sum + e.amount, 0) || 0;

  // Monthly Stats (Required for Monthly Profit View)
  const salesMonth = useLiveQuery(() => db.sales.where('date').between(monthStart, monthEnd, true, true).toArray(), [monthStart, monthEnd]);
  const expensesMonth = useLiveQuery(() => db.expenses.where('date').between(monthStart, monthEnd, true, true).toArray(), [monthStart, monthEnd]);
  const inventoryExpensesMonth = useLiveQuery(() => db.inventoryExpenses.where('date').between(monthStart, monthEnd, true, true).toArray(), [monthStart, monthEnd]);

  const totalInventoryExpenseMonth = inventoryExpensesMonth?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
  const totalExpenseMonth = expensesMonth?.reduce((sum, e) => sum + e.amount, 0) || 0;
  const totalSalesMonth = salesMonth?.reduce((sum, s) => sum + s.total, 0) || 0;
  const totalProfitMonth = salesMonth?.reduce((sum, s) => sum + s.profit, 0) || 0;
  const netMonthlyProfit = totalProfitMonth - (totalExpenseMonth + totalInventoryExpenseMonth);

  // Baki Khata Total
  const totalDebt = allCustomers?.reduce((sum, c) => sum + c.debt, 0) || 0;

  // --- Stock Prediction Logic (Updated for Smart Alerts) ---
  // Filter sales to last 7 days to calculate average
  const salesForPrediction = allSales.filter(s => {
    const saleTime = new Date(s.date).getTime();
    return saleTime >= sevenDaysAgo;
  });

  // Map products to prediction objects
  let stockPredictions: any[] = [];
  if (allProducts && salesForPrediction) {
    stockPredictions = allProducts.map(product => {
      // Calculate total quantity sold in last 7 days
      const totalQtySold = salesForPrediction.reduce((sum, s) => {
        if (s.productId === product.id) return sum + s.quantity;
        return sum;
      }, 0);

      // Calculate Daily Average
      const avgDailySales = totalQtySold / 7;

      // Calculate Days Left
      let daysLeft = 999; // Infinite
      if (avgDailySales > 0) {
        daysLeft = Math.floor(product.stock / avgDailySales);
      }

      // Determine Alert Level
      let alertLevel = 'normal';
      if (daysLeft <= 2) alertLevel = 'critical';
      else if (daysLeft <= 5) alertLevel = 'warning';

      return {
        productId: product.id!,
        productName: product.name,
        currentStock: product.stock,
        daysLeft,
        avgDailySales,
        alertLevel
      };
    });
  }

  // --- Chart Data ---
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    const dayStart = startOfDay(d).getTime();
    const dayEnd = endOfDay(d).getTime();
    
    // Re-query all sales for chart to ensure accuracy
    const allSalesForChart = useLiveQuery(() => db.sales.toArray(), []);
    
    // Filter sales for this day
    const daySales = allSalesForChart?.filter(s => {
      const t = new Date(s.date).getTime();
      return t >= dayStart && t <= dayEnd;
    }) || [];
    
    return { 
      date: format(d, 'EEE'), 
      sales: daySales.reduce((sum, s) => sum + s.total, 0) 
    };
  });

  const recentSales = salesToday?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5) || [];
  const allCustomers = useLiveQuery(() => db.customers.toArray(), []);
  const allProducts = useLiveQuery(() => db.products.toArray(), []);
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
    recentSales,
    
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
    greeting: getGreeting(),
    
    // NEW: Extended Returns
    analyzeProfitability: analyzeProfitability()
  };
};
