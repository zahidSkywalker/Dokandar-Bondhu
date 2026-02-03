import Dexie, { Table, IndexableType } from 'dexie';
import { Product, Sale, Expense, Customer, Staff, InventoryExpense } from '../types';

class DokandarDB extends Dexie {
  products!: Table<Product>;
  sales!: Table<Sale>;
  expenses!: Table<Expense>;
  customers!: Table<Customer>;
  staff!: Table<Staff>;
  inventoryExpenses!: Table<InventoryExpense>;
  
  // NEW: Market Prices Table
  marketPrices!: Table<any>; 

  constructor() {
    super('DokandarBondhuDB');
  }

  // Version 1 Schema (Existing)
  this.version(1).stores({
    products: '++id, name, category, stock, buyPrice, sellPrice, unit',
    sales: '++id, productId, productName, quantity, buyPrice, sellPrice, total, profit, date',
    expenses: '++id, category, amount, note, date',
    customers: '++id, name, phone, address, debt',
    staff: '++id, name, role, active'
  });

  // Version 2 Schema (Adding Market Prices)
  this.version(2).stores({
    products: '++id, name, category, stock, buyPrice, sellPrice, unit',
    sales: '++id, productId, productName, quantity, buyPrice, sellPrice, total, profit, date, customerId, staffId',
    expenses: '++id, category, amount, note, date',
    customers: '++id, name, phone, address, debt',
    staff: '++id, name, role, active',
    marketPrices: '++id, name, unit, minPrice, maxPrice, date'
  }).upgrade(tx => {
    return tx.table('marketPrices').clear(); 
  });
}
export const db = new DokandarDB();
