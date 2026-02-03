import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { db } from '../db/db';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ... (Keep existing formatCurrency, formatDate, toBanglaDigits, toEnglishDigits)

// NEW: Get Real-time Greeting
export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  if (hour < 21) return "Good Evening";
  return "Good Night";
};

// NEW: Export Data to CSV
export const exportToCSV = async (data: any[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// NEW: Backup Database
export const backupDatabase = async () => {
  const backup = {
    products: await db.products.toArray(),
    sales: await db.sales.toArray(),
    expenses: await db.expenses.toArray(),
    customers: await db.customers.toArray(),
    staff: await db.staff.toArray(),
    inventoryExpenses: await db.inventoryExpenses.toArray(),
    date: new Date()
  };
  
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `dokandar_backup_${Date.now()}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// NEW: Restore Database
export const restoreDatabase = async (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        await db.transaction('rw', db.tables, async () => {
          await db.products.clear();
          await db.sales.clear();
          await db.expenses.clear();
          await db.customers.clear();
          await db.staff.clear();
          await db.inventoryExpenses.clear();

          if (data.products) await db.products.bulkAdd(data.products);
          if (data.sales) await db.sales.bulkAdd(data.sales);
          if (data.expenses) await db.expenses.bulkAdd(data.expenses);
          if (data.customers) await db.customers.bulkAdd(data.customers);
          if (data.staff) await db.staff.bulkAdd(data.staff);
          if (data.inventoryExpenses) await db.inventoryExpenses.bulkAdd(data.inventoryExpenses);
        });
        resolve(true);
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsText(file);
  });
};
