import Dexie, { Table } from 'dexie';
import { Product, Sale, Expense, Customer, Staff, InventoryExpense, MarketPrice, Supplier, StockPrediction } from '../types';

class DokandarDB extends Dexie {
  // Added `stock` index to allow fast lookups like "where stock > 0"
  products!: Table<Product, { stock: number }>; 
  sales!: Table<Sale>;
  expenses!: Table<Expense>;
  customers!: Table<Customer>;
  staff!: Table<Staff>;
  inventoryExpenses!: Table<InventoryExpense>;
  marketPrices!: Table<MarketPrice>;
  suppliers!: Table<Supplier>; // NEW: For Feature 3
  // Optional: For caching daily stats calculation
  dailyStats!: Table<any>;
  // NEW: Supplier Store
  suppliers!: Table<Supplier>;
  constructor() {
    super('DokandarBondhuDB');
    
    // Version 3 Schema (Existing)
    this.version(3).stores({
      products: '++id, name, category, stock',
      sales: '++id, productId, customerId, staffId, date',
      expenses: '++id, category, date',
      customers: '++id, name, debt',
      staff: '++id, name, role',
      inventoryExpenses: '++id, productId, date',
      marketPrices: '++id, category, dateFetched'
    }).upgrade(tx => {
      console.log("Database migrated to V3");
    });

    // Version 4 Schema (Smart Low-Stock)
    this.version(4).stores({
      products: '++id, name, category, stock', // stock index added
      sales: '++id, productId, customerId, staffId, date',
      expenses: '++id, category, date',
      customers: '++id, name, debt',
      staff: '++id, name, role',
      inventoryExpenses: '++id, productId, date',
      marketPrices: '++id, category, dateFetched',
      suppliers: '++id, name, phone', // NEW
      stockPredictions: '++id, productId, date, alertLevel' // NEW
    }).upgrade(tx => {
      console.log("Database migrated to V4 (Smart Stock Alerts)");
    });
  }
}

export const db = new DokandarDB();
