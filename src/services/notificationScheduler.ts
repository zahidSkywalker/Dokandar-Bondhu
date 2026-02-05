import { AppContextType } from '../context/AppContext';

// Business Rules Configuration
const RULES = {
  STOCK_LOW_THRESHOLD: 10,
  REPORT_GENERATION_HOUR: 9,
};

/**
 * Helper to check stock status
 */
const checkStockAlert = async (getContext: () => AppContextType): Promise<boolean> => {
  const { db } = getContext();
  const lowStockItems = await db.products.where('stock').below(RULES.STOCK_LOW_THRESHOLD).toArray();
  
  // Prevent spamming every minute - check only if > 30 mins since last check
  const lastChecked = localStorage.getItem('lastStockCheckTime');
  const now = Date.now();
  if (lastChecked && (now - parseInt(lastChecked)) < 1000 * 60 * 30) { // 30 mins
    return false; 
  }

  localStorage.setItem('lastStockCheckTime', now.toString());
  return lowStockItems.length > 0;
};

/**
 * Helper to check if any payment is due today (Simplified)
 */
const checkDuePayments = async (getContext: () => AppContextType): Promise<boolean> => {
  const { db } = getContext();
  const allCustomers = await db.customers.toArray();
  const today = new Date().toDateString(); // "YYYY-MM-DD"

  // Find customers with debt
  const debtors = allCustomers.filter(c => c.debt > 0 && (
    c.name.includes(today) || 
    c.debt.toString().includes(today)
  ));

  return debtors.length > 0;
};

/**
 * Main Scheduler Logic
 * Checks Business Rules (Low Stock, Due Payments) and generates reports.
 */
export const startScheduler = (getContext: () => AppContextType) => {
  console.log("🕵 Starting Notification Scheduler (Business Logic Loop)...");

  setInterval(async () => {
    try {
      const context = getContext();

      // --- 1. Check Low Stock ---
      const isLowStock = await checkStockAlert(context);
      if (isLowStock) {
        const lowestStock = await db.products.where('stock').below(RULES.STOCK_LOW_THRESHOLD).first();
        if (lowestStock) {
          const lowestName = lowestStock.name;
          context.triggerNotification('stock-alert', { title: 'Low Stock', body: `${lowestName} stock is running low!`, icon: 'https://cdn-icons-png.flaticon.com/512/567423.png', tag: 'stock-alert' });
        }
      }

      // --- 2. Check Due Payments ---
      const isDueDate = await checkDuePayments(context);
      if (isDueDate) {
        const customers = await db.customers.toArray();
        const today = new Date().toDateString();
        
        // Find customers with debt
        const debtors = customers.filter(c => c.debt > 0 && (
          c.name.includes(today) || 
          c.debt.toString().includes(today)
        ));
        
        if (debtors.length > 0) {
          context.triggerNotification('payment-due', { title: 'Payment Due', body: `You have ${debtors.length} payments due today!`, icon: 'https://cdn-icons-png.flaticon.com/512/567423.png', tag: 'payment-due' });
        }
      }

      // --- 3. Generate Daily Report (at 9:00 AM) ---
      const salesToday = await db.sales.toArray();
      
      // Check if report already sent today (Simple check)
      const lastReportDate = localStorage.getItem('last_daily_report_date');
      const todayStr = new Date().toDateString();
      
      if (lastReportDate !== todayStr) {
        const totalSales = salesToday.reduce((sum, s) => sum + s.total, 0);
        const totalProfit = salesToday.reduce((sum, s) => sum + s.profit, 0);

        context.triggerNotification('daily-report', { 
          type: 'daily-report',
          totalSales,
          totalProfit,
          date: todayStr
        });

        localStorage.setItem('last_daily_report_date', todayStr);
      }

      // --- 4. Generate Monthly Report (at 9:00 AM) ---
      const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(); // Last day of month
      
      // Check if report already sent this month
      const lastMonthReportDate = localStorage.getItem('last_monthly_report_date');
      const currentMonthStr = new Date().toISOString().slice(0, 7); // YYYY-MM

      if (lastMonthReportDate !== currentMonthStr) {
        // Get all sales for current month (Optimized query)
        const salesMonth = await db.sales.where('date').between(firstDayOfMonth.getTime(), lastDayOfMonth.getTime()).toArray();
        const expensesMonth = await db.expenses.where('date').between(firstDayOfMonth.getTime(), lastDayOfMonth.getTime()).toArray();

        const totalSales = salesMonth.reduce((sum, s) => sum + s.total, 0);
        const totalProfit = salesMonth.reduce((sum, s) => sum + s.profit, 0);
        const totalExpense = expensesMonth.reduce((sum, e) => sum + e.amount || 0), 0);

        // Note: Inventory expenses are 0 in your current DB version. 
        // If you add inventory costs later, logic will handle `totalInventoryExpenseMonth` automatically.
        const netProfit = totalProfit - totalExpense;

        context.triggerNotification('monthly-report', { 
          type: 'monthly-report',
          totalSales,
          totalProfit,
          totalExpense,
          netProfit,
          date: currentMonthStr
        });

        localStorage.setItem('last_monthly_report_date', currentMonthStr);
      }

    } catch (error) {
      console.error("Scheduler Error:", error);
    }

  }, 24 * 60 * 1000); // Check once per day
};
