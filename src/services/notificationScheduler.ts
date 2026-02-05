import { db } from '../db/db';

// Business Rules Configuration
const RULES = {
  STOCK_LOW_THRESHOLD: 10,
  REPORT_GENERATION_HOUR: 9,
};

/**
 * Helper to check stock status
 */
const checkStockAlert = async (): Promise<boolean> => {
  try {
    const lowStockItems = await db.products.where('stock').below(RULES.STOCK_LOW_THRESHOLD).toArray();
    
    // Prevent spamming - check only if > 30 mins since last check
    const lastChecked = localStorage.getItem('lastStockCheckTime');
    const now = Date.now();
    if (lastChecked && (now - parseInt(lastChecked)) < 1000 * 60 * 30) { 
      return false; 
    }

    localStorage.setItem('lastStockCheckTime', now.toString());
    return lowStockItems.length > 0;
  } catch (error) {
    console.error("checkStockAlert Error:", error);
    return false;
  }
};

/**
 * Helper to check if any payment is due today (Simplified)
 */
const checkDuePayments = async (): Promise<boolean> => {
  try {
    const allCustomers = await db.customers.toArray();
    const today = new Date().toDateString(); // "YYYY-MM-DD"

    // Find customers with debt
    const debtors = allCustomers.filter(c => c.debt > 0 && (
      c.name.includes(today) || 
      c.debt.toString().includes(today)
    ));

    return debtors.length > 0;
  } catch (error) {
    console.error(" checkDuePayments Error:", error);
    return false;
  }
};

/**
 * Main Scheduler Logic
 * Checks Business Rules (Low Stock, Due Payments) and generates reports.
 * 
 * @param triggerNotification - Passed in from AppContext to dispatch notifications
 */
export const startScheduler = (triggerNotification: (type: string, payload: any) => Promise<void>) => {
  console.log("🕵 Starting Notification Scheduler (Business Logic Loop)...");

  setInterval(async () => {
    try {
      // --- 1. Check Low Stock ---
      const isLowStock = await checkStockAlert();
      if (isLowStock) {
        const lowestStock = await db.products.where('stock').below(RULES.STOCK_LOW_THRESHOLD).first();
        if (lowestStock) {
          const lowestName = lowestStock.name;
          triggerNotification('stock-alert', { title: 'Low Stock', body: `${lowestName} stock is running low!`, icon: 'https://cdn-icons-png.flaticon.com/512/567423.png', tag: 'stock-alert' });
        }
      }

      // --- 2. Check Due Payments ---
      const isDueDate = await checkDuePayments();
      if (isDueDate) {
        const customers = await db.customers.toArray();
        const today = new Date().toDateString();
        
        // Find customers with debt
        const debtors = customers.filter(c => c.debt > 0 && (
          c.name.includes(today) || 
          c.debt.toString().includes(today)
        ));
        
        if (debtors.length > 0) {
          triggerNotification('payment-due', { title: 'Payment Due', body: `You have ${debtors.length} payments due today!`, icon: 'https://cdn-icons-png.flaticon.com/512/567423.png', tag: 'payment-due' });
        }
      }

      // --- 3. Generate Daily Report ---
      const salesToday = await db.sales.toArray();
      
      const lastReportDate = localStorage.getItem('last_daily_report_date');
      const todayStr = new Date().toDateString();
      
      if (lastReportDate !== todayStr) {
        const totalSales = salesToday.reduce((sum, s) => sum + s.total, 0);
        const totalProfit = salesToday.reduce((sum, s) => sum + s.profit, 0);

        triggerNotification('daily-report', { 
          type: 'daily-report',
          totalSales,
          totalProfit,
          date: todayStr
        });
        localStorage.setItem('last_daily_report_date', todayStr);
      }

      // --- 4. Generate Monthly Report ---
      const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getTime(); 
      const lastMonthReportDate = localStorage.getItem('last_monthly_report_date');
      const currentMonthStr = new Date().toISOString().slice(0, 7);

      if (lastMonthReportDate !== currentMonthStr) {
        const salesMonth = await db.sales.where('date').between(firstDayOfMonth.getTime(), lastDayOfMonth).toArray();
        const expensesMonth = await db.expenses.where('date').between(firstDayOfMonth.getTime(), lastDayOfMonth).toArray();

        const totalSales = salesMonth.reduce((sum, s) => sum + s.total, 0);
        const totalProfit = salesMonth.reduce((sum, s) => sum + s.profit, 0);
        const totalExpense = expensesMonth.reduce((sum, e) => sum + (e.amount || 0), 0);
        const netProfit = totalProfit - totalExpense;

        triggerNotification('monthly-report', { 
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

  }, 24 * 60 * 1000); 
};
