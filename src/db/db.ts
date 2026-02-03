import Dexie, { Table } from 'dexie';
import { Product, Sale, Expense, Customer, Staff, InventoryExpense } from '../types';

class DokandarDB extends Dexie {
  products!: Table<Product>;
  sales!: Table<Sale>;
  expenses!: Table<Expense>;
  customers!: Table<Customer>;
  staff!: Table<Staff>;
  inventoryExpenses!: Table<InventoryExpense>;

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
      sales: '++id, productId, customerId, staffId, date', // Added customerId, staffId
      expenses: '++id, category, date',
      customers: '++id, name, debt', // New Table
      staff: '++id, name, role', // New Table
      inventoryExpenses: '++id, productId, date' // New Table
    }).upgrade(tx => {
      console.log("Database migrated to V2");
    });
  }
}

export const db = new DokandarDB();
