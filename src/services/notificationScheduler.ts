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
    const lowStockItems = await db.products
      .where('stock')
      .below(RULES.STOCK_LOW_THRESHOLD)
      .toArray();

    // Prevent spamming (30 min cooldown)
    const lastChecked = localStorage.getItem('lastStockCheckTime');
    const now = Date.now();

    if (lastChecked && now - parseInt(lastChecked, 10) < 30 * 60 * 1000) {
      return false;
    }

    localStorage.setItem('lastStockCheckTime', now.toString());
    return lowStockItems.length > 0;
  } catch (error) {
    console.error('checkStockAlert Error:', error);
    return false;
  }
};

/**
 * Helper to check due payments (simplified logic)
 */
const checkDuePayments = async (): Promise<boolean> => {
  try {
    const customers = await db.customers.toArray();
    const today = new Date().toDateString();

    const debtors = customers.filter(
      c => c.debt > 0 && c.name.includes(today)
    );

    return debtors.length > 0;
  } catch (error) {
    console.error('checkDuePayments Error:', error);
    return false;
  }
};

/**
 * Main Scheduler
 */
export const startScheduler = (
  triggerNotification: (type: string, payload: any) => Promise<void>
) => {
  console.log('🕵️ Notification Scheduler started');

  setInterval(async () => {
    try {
      /* ------------------ LOW STOCK ------------------ */
      const isLowStock = await checkStockAlert();

      if (isLowStock) {
        const item = await db.products
          .where('stock')
          .below(RULES.STOCK_LOW_THRESHOLD)
          .first();

        if (item) {
          await triggerNotification('stock-alert', {
            title: 'Low Stock',
            body: `${item.name} stock is running low!`,
            icon: 'https://cdn-icons-png.flaticon.com/512/567423.png',
            tag: 'stock-alert',
          });
        }
      }

      /* ------------------ DUE PAYMENTS ------------------ */
      const isDue = await checkDuePayments();

      if (isDue) {
        const customers = await db.customers.toArray();
        const today = new Date().toDateString();

        const debtors = customers.filter(
          c => c.debt > 0 && c.name.includes(today)
        );

        if (debtors.length > 0) {
          await triggerNotification('payment-due', {
            title: 'Payment Due',
            body: `You have ${debtors.length} payments due today!`,
            icon: 'https://cdn-icons-png.flaticon.com/512/567423.png',
            tag: 'payment-due',
          });
        }
      }

      /* ------------------ DAILY REPORT ------------------ */
      const todayStr = new Date().toDateString();
      const lastDaily = localStorage.getItem('last_daily_report_date');

      if (lastDaily !== todayStr) {
        const salesToday = await db.sales.toArray();

        const totalSales = salesToday.reduce((s, x) => s + x.total, 0);
        const totalProfit = salesToday.reduce((s, x) => s + x.profit, 0);

        await triggerNotification('daily-report', {
          type: 'daily-report',
          totalSales,
          totalProfit,
          date: todayStr,
        });

        localStorage.setItem('last_daily_report_date', todayStr);
      }

      /* ------------------ MONTHLY REPORT ------------------ */
      const now = new Date();
      const monthKey = now.toISOString().slice(0, 7);
      const lastMonthly = localStorage.getItem('last_monthly_report_date');

      if (lastMonthly !== monthKey) {
        const start = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).getTime();

        const salesMonth = await db.sales
          .where('date')
          .between(start, end)
          .toArray();

        const expensesMonth = await db.expenses
          .where('date')
          .between(start, end)
          .toArray();

        const totalSales = salesMonth.reduce((s, x) => s + x.total, 0);
        const totalProfit = salesMonth.reduce((s, x) => s + x.profit, 0);
        const totalExpense = expensesMonth.reduce(
          (s, e) => s + (e.amount || 0),
          0
        );

        const netProfit = totalProfit - totalExpense;

        await triggerNotification('monthly-report', {
          type: 'monthly-report',
          totalSales,
          totalProfit,
          totalExpense,
          netProfit,
          date: monthKey,
        });

        localStorage.setItem('last_monthly_report_date', monthKey);
      }
    } catch (error) {
      console.error('Scheduler Error:', error);
    }
  }, 24 * 60 * 60 * 1000); // ✅ once per day
};
