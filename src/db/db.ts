import Dexie, { Table } from 'dexie';
import { Product, Sale, Expense, Customer, Staff, InventoryExpense, MarketPrice } from '../types';

class DokandarDB extends Dexie {
  products!: Table<Product>;
  sales!: Table<Sale>;
  expenses!: Table<Expense>;
  customers!: Table<Customer>;
  staff!: Table<Staff>;
  inventoryExpenses!: Table<InventoryExpense>;
  marketPrices!: Table<MarketPrice>; // NEW

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
      marketPrices: '++id, category, dateFetched' // Index for efficient filtering
    }).upgrade(tx => {
      console.log("Database migrated to V3 (Market Prices Added)");
    });
  }
}

export const db = new DokandarDB();
