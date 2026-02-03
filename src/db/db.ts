import Dexie, { Table } from 'dexie';
import {
  Product,
  Sale,
  Expense,
  Customer,
  Staff,
  InventoryExpense
} from '../types';

export interface MarketPrice {
  id?: number;
  name: string;
  unit: string;
  minPrice: number;
  maxPrice: number;
  date: string;
}

class DokandarDB extends Dexie {
  products!: Table<Product>;
  sales!: Table<Sale>;
  expenses!: Table<Expense>;
  customers!: Table<Customer>;
  staff!: Table<Staff>;
  inventoryExpenses!: Table<InventoryExpense>;
  marketPrices!: Table<MarketPrice>;

  constructor() {
    super('DokandarBondhuDB');

    // Version 1
    this.version(1).stores({
      products: '++id, name, category, stock, buyPrice, sellPrice, unit',
      sales: '++id, productId, productName, quantity, buyPrice, sellPrice, total, profit, date',
      expenses: '++id, category, amount, note, date',
      customers: '++id, name, phone, address, debt',
      staff: '++id, name, role, active'
    });

    // Version 2 (Market Prices)
    this.version(2)
      .stores({
        products: '++id, name, category, stock, buyPrice, sellPrice, unit',
        sales: '++id, productId, productName, quantity, buyPrice, sellPrice, total, profit, date, customerId, staffId',
        expenses: '++id, category, amount, note, date',
        customers: '++id, name, phone, address, debt',
        staff: '++id, name, role, active',
        marketPrices: '++id, name, date'
      })
      .upgrade(tx => tx.table('marketPrices').clear());
  }
}

export const db = new DokandarDB();
