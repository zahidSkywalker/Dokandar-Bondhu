import Dexie, { Table } from 'dexie';
import { Product, Sale, Expense, Customer, Staff, InventoryExpense, MarketPrice, Supplier, PriceHistory, Payment } from '../types';

class DokandarDB extends Dexie {
  products!: Table<Product>;
  sales!: Table<Sale>;
  expenses!: Table<Expense>;
  customers!: Table<Customer>;
  staff!: Table<Staff>;
  inventoryExpenses!: Table<InventoryExpense>;
  marketPrices!: Table<MarketPrice>;
  suppliers!: Table<Supplier>;
  priceHistory!: Table<PriceHistory>;
  payments!: Table<Payment>; // NEW

  constructor() {
    super('DokandarBondhuDB');
    
    this.version(1).stores({
      products: '++id, name, category, stock',
      sales: '++id, productId, date',
      expenses: '++id, category, date'
    });

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

    this.version(4).stores({
      products: '++id, name, category, stock',
      sales: '++id, productId, customerId, staffId, date, dueDate',
      expenses: '++id, category, date',
      customers: '++id, name, debt, notes',
      staff: '++id, name, role',
      inventoryExpenses: '++id, productId, date, supplierId',
      marketPrices: '++id, category, dateFetched',
      suppliers: '++id, name, phone',
      priceHistory: '++id, productId, date'
    }).upgrade(tx => {
      console.log("Database migrated to V4 (Suppliers, Price History, Advanced Khata)");
    });

    // ==========================================
    // VERSION 5: LEDGER STATEMENTS
    // ==========================================
    this.version(5).stores({
      products: '++id, name, category, stock',
      sales: '++id, productId, customerId, staffId, date, dueDate',
      expenses: '++id, category, date',
      customers: '++id, name, debt, notes',
      staff: '++id, name, role',
      inventoryExpenses: '++id, productId, date, supplierId',
      marketPrices: '++id, category, dateFetched',
      suppliers: '++id, name, phone',
      priceHistory: '++id, productId, date',
      payments: '++id, customerId, date' // NEW TABLE
    }).upgrade(tx => {
      console.log("Database migrated to V5 (Payments Tracking)");
    });
  }
}

export const db = new DokandarDB();
