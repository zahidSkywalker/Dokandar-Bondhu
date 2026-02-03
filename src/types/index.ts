export interface Product {
  id?: number; // Auto-incremented by Dexie
  name: string;
  nameBn?: string; // Optional Bangla name
  buyPrice: number;
  sellPrice: number;
  stock: number;
  unit: string; // e.g., 'pcs', 'kg', 'pkt'
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id?: number;
  productId: number;
  productName: string; // Denormalized for performance (avoiding constant joins)
  quantity: number;
  buyPrice: number; // Stored to calculate profit even if product price changes later
  sellPrice: number;
  total: number; // sellPrice * quantity
  profit: number; // (sellPrice - buyPrice) * quantity
  date: Date;
}

export interface Expense {
  id?: number;
  category: string; // 'Rent', 'Electricity', 'Transport', 'Withdrawal'
  amount: number;
  note?: string;
  date: Date;
}

export interface DailyStats {
  date: string; // 'YYYY-MM-DD'
  totalSales: number;
  totalProfit: number;
  totalExpense: number;
}

export type Language = 'en' | 'bn';

export interface Translation {
  common: Record<string, string>;
  dashboard: Record<string, string>;
  sales: Record<string, string>;
  inventory: Record<string, string>;
  expenses: Record<string, string>;
}
