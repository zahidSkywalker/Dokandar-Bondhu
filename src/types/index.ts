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
  customerId?: number;
  staffId?: number;
  dueDate?: Date; // NEW: Feature 1
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
  supplierId?: number; // NEW: Feature 3
}

export interface Customer {
  id?: number;
  name: string;
  phone?: string;
  address?: string;
  debt: number;
  lastPaymentDate?: Date;
  createdAt: Date;
  notes?: string; // NEW: Feature 1
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

// ==========================================
// NEW: Market Price Interface
// ==========================================
export interface MarketPrice {
  id?: number;
  nameEn: string;
  nameBn: string;
  unit: string;
  minPrice: number;
  maxPrice: number;
  category: string;
  dateFetched: Date;
}

// ==========================================
// NEW: Supplier Interface (Feature 3)
// ==========================================
export interface Supplier {
  id?: number;
  name: string;
  phone?: string;
  notes?: string;
  totalDue?: number; // Derived field for UI display
}

// ==========================================
// NEW: Price History Interface (Feature 6)
// ==========================================
export interface PriceHistory {
  id?: number;
  productId: number;
  buyPrice: number;
  sellPrice: number;
  date: Date;
}

// ==========================================
// FIXED: Translation Interface Structure
// ==========================================
interface MarketTranslation {
  title: string;
  subtitle: string;
  source: string;
  categories: {
    all: string;
    rice: string;
    vegetables: string;
    spices: string;
    meat: string;
    fruits: string;
    essentials: string;
  };
  priceRange: string;
  unit: string;
  emptyState: string;
  syncSuccess: string;
  syncError: string;
  syncInProgress: string;
}

export interface Translation {
  common: Record<string, string>;
  dashboard: Record<string, string>;
  sales: Record<string, string>;
  inventory: Record<string, string>;
  expenses: Record<string, string>;
  ledger: Record<string, string>;
  staff: Record<string, string>;
  market: MarketTranslation;
}

// NEW: Stock Prediction & Alert Types
export interface StockPrediction {
  productId: number;
  productName: string;
  currentStock: number;
  daysLeft: number;
  avgDailySales: number;
  alertLevel: 'critical' | 'warning' | 'normal';
}
