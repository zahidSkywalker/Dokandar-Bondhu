import Dexie, { Table } from 'dexie';
import { Product, Sale, Expense, Customer, Staff, InventoryExpense, MarketPrice, Supplier, PriceHistory } from '../types';

class DokandarDB extends Dexie {
  products!: Table<Product>;
  sales!: Table<Sale>;
  expenses!: Table<Expense>;
  customers!: Table<Customer>;
  staff!: Table<Staff>;
  inventoryExpenses!: Table<InventoryExpense>;
  marketPrices!: Table<MarketPrice>;
  suppliers!: Table<Supplier>; // NEW
  priceHistory!: Table<PriceHistory>; // NEW

  constructor() {
    super('DokandarBondhuDB');
    
    // Version 1 Schema
    this.version(1).stores({
      products: '++id, name, category, stock',
      sales: '++id, productId, date',
      expenses: '++id, category, date'
    });

    // Version 2 Schema (Migration)
    this.version(2).stores({
      products: '++id, name, category, stock',
      sales: '++id, productId, customerId, staffId, date',
      expenses: '++id, category, date',
      customers: '++id, name, debt',
      staff: '++id, name, role',
      inventoryExpenses: '++id, productId, date'
    }).upgrade(tx => {
      console.log("Database migrated to V2");
    });

    // Version 3 Schema (Market Prices)
    this.version(3).stores({
      products: '++id, name, category, stock',
      sales: '++id, productId, customerId, staffId, date',
      expenses: '++id, category, date',
      customers: '++id, name, debt',
      staff: '++id, name, role',
      inventoryExpenses: '++id, productId, date',
      marketPrices: '++id, category, dateFetched'
    }).upgrade(tx => {
      console.log("Database migrated to V3 (Market Prices Added)");
    });

    // ==========================================
    // VERSION 4: NEW FEATURES (Feature 1, 3, 6)
    // ==========================================
    this.version(4).stores({
      products: '++id, name, category, stock',
      sales: '++id, productId, customerId, staffId, date, dueDate', // Added dueDate
      expenses: '++id, category, date',
      customers: '++id, name, debt, notes', // Added notes
      staff: '++id, name, role',
      inventoryExpenses: '++id, productId, date, supplierId', // Added supplierId
      marketPrices: '++id, category, dateFetched',
      suppliers: '++id, name, phone', // New Table
      priceHistory: '++id, productId, date' // New Table
    }).upgrade(tx => {
      console.log("Database migrated to V4 (Suppliers, Price History, Advanced Khata)");
    });
  }
}

export const db = new DokandarDB();
