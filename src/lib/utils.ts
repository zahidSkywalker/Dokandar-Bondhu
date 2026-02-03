import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Sun, SunDim, Sunset, Moon, Star } from 'lucide-react';
import { db } from '../db/db';

// --- TAILWIND UTILS ---

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- FORMATTING UTILS ---

export const formatCurrency = (amount: number, lang: 'en' | 'bn' = 'en'): string => {
  const symbol = '৳';
  const value = lang === 'bn' ? toBanglaDigits(amount.toFixed(2)) : amount.toFixed(2);
  return `${symbol} ${value}`;
};

export const formatDate = (date: Date, lang: 'en' | 'bn' = 'en'): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return new Intl.DateTimeFormat(lang === 'bn' ? 'bn-BD' : 'en-US', options).format(date);
};

export const toBanglaDigits = (str: string | number): string => {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return str.toString().replace(/[0-9]/g, (digit) => banglaDigits[parseInt(digit)]);
};

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

export const getGreetingIcon = (): React.ReactElement => {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return <Sun className="text-yellow-500 w-8 h-8" />;
  } else if (hour < 14) { 
    // Noon: Bright Sun
    return <Sun className="text-orange-400 w-8 h-8" />;
  } else if (hour < 17) { 
    // Afternoon: Dim Sun
    return <SunDim className="text-orange-500 w-8 h-8" />;
  } else if (hour < 21) { 
    // Evening: Sunset
    return <Sunset className="text-purple-500 w-8 h-8" />;
  } else {
    // Night: Moon + Star
    return (
      <div className="flex items-center gap-1 relative">
        <Moon className="text-blue-300 w-7 h-7" />
        <Star className="text-yellow-200 w-3 h-3 absolute top-0 right-0 animate-pulse" />
      </div>
    );
  }
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
          // Clear existing data
          await db.products.clear();
          await db.sales.clear();
          await db.expenses.clear();
          await db.customers.clear();
          await db.staff.clear();
          await db.inventoryExpenses.clear();

          // Restore data
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
