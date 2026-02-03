export interface Product {
  id?: number;
  name: string;
  nameBn?: string;
  buyPrice: number;
  sellPrice: number;
  stock: number;
  unit: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id?: number;
  productId: number;
  productName: string;
  quantity: number;
  buyPrice: number;
  sellPrice: number;
  total: number;
  profit: number;
  date: Date;
  customerId?: number; // For Baki Khata
  staffId?: number; // For Employee Tracking
}

export interface Expense {
  id?: number;
  category: string;
  amount: number;
  note?: string;
  date: Date;
}

export interface InventoryExpense {
  id?: number;
  productId?: number;
  description: string;
  amount: number;
  date: Date;
}

export interface Customer {
  id?: number;
  name: string;
  phone?: string;
  address?: string;
  debt: number;
  lastPaymentDate?: Date;
  createdAt: Date;
}

export interface Staff {
  id?: number;
  name: string;
  role: string;
  active: boolean;
}

export interface DailyStats {
  date: string;
  totalSales: number;
  totalProfit: number;
  totalExpense: number;
}

export type Language = 'en' | 'bn';
export type Theme = 'light' | 'dark';

export interface Translation {
  common: Record<string, string>;
  dashboard: Record<string, string>;
  sales: Record<string, string>;
  inventory: Record<string, string>;
  expenses: Record<string, string>;
  ledger: Record<string, string>;
  staff: Record<string, string>;
  market: Record<string, string>; // NEW
}

// NEW: Market Price Interface
export interface MarketPrice {
  id?: number;
  nameEn: string;
  nameBn: string;
  unit: string;
  minPrice: number;
  maxPrice: number;
  category: string; // e.g., 'Rice', 'Vegetables', 'Spices'
  dateFetched: Date;
}
