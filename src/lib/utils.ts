import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

// Utility to convert English digits to Bangla digits
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
