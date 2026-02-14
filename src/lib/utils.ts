import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Sun, SunDim, Sunset, Moon } from 'lucide-react';
import { db } from '../db/db';

// --- TAILWIND UTILS ---

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- FORMATTING UTILS ---

/**
 * Formats currency with accounting-style separators.
 * - Bengali (bn): Uses Indian subcontinent grouping (XX,XX,XXX) and Bengali digits.
 * - English (en): Uses International grouping (X,XXX).
 */
export const formatCurrency = (amount: number, lang: 'en' | 'bn' = 'en'): string => {
  const safeAmount = isNaN(amount) ? 0 : amount;
  
  // 1. Define Locale
  // 'bn-BD' triggers Indian subcontinent numbering system (Lakh, Crore)
  // 'en-US' triggers international system (Million, Billion)
  const locale = lang === 'bn' ? 'bn-BD' : 'en-US';

  try {
    // 2. Format using Intl.NumberFormat
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0, // Cleaner look for whole numbers
      maximumFractionDigits: 2,
    }).format(safeAmount);
  } catch (e) {
    // Fallback for older browsers
    const symbol = '৳';
    const value = lang === 'bn' ? toBanglaDigits(safeAmount.toFixed(2)) : safeAmount.toFixed(2);
    return `${symbol} ${value}`;
  }
};

/**
 * Formats plain numbers with separators (no currency symbol).
 */
export const formatNumber = (num: number, lang: 'en' | 'bn' = 'en'): string => {
  const safeNum = isNaN(num) ? 0 : num;
  const locale = lang === 'bn' ? 'bn-BD' : 'en-US';
  
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(safeNum);
};

export const formatDate = (date: Date, lang: 'en' | 'bn' = 'en'): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return new Intl.DateTimeFormat(lang === 'bn' ? 'bn-BD' : 'en-US', options).format(date);
};

// Helper to convert string/number to Bengali digits (used if Intl is not available)
export const toBanglaDigits = (str: string | number): string => {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return str.toString().replace(/[0-9]/g, (digit) => banglaDigits[parseInt(digit)]);
};

// Helper to convert Bengali digits in inputs back to English for calculation
export const toEnglishDigits = (str: string): string => {
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  
  return str.split('').map(char => {
    const index = banglaDigits.indexOf(char);
    return index !== -1 ? englishDigits[index] : char;
  }).join('');
};

// --- GREETING UTILS ---

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  if (hour < 21) return "Good Evening";
  return "Good Night";
};

// Returns the Component Definition (Safe for .ts files)
export const getGreetingIcon = () => {
  const hour = new Date().getHours();
  if (hour < 12) return Sun;
  if (hour < 14) return Sun; // Noon
  if (hour < 17) return SunDim; // Afternoon
  if (hour < 21) return Sunset; // Evening
  return Moon; // Night
};

// --- DATA EXPORT / BACKUP UTILS ---

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
      } catch (err) { reject(err); }
    };
    reader.readAsText(file);
  });
};
