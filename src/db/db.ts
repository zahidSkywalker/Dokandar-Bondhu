import Dexie, { Table } from 'dexie';
import { Product, Sale, Expense } from '../types';

class DokandarDB extends Dexie {
  products!: Table<Product>;
  sales!: Table<Sale>;
  expenses!: Table<Expense>;

  constructor() {
    super('DokandarBondhuDB');
    
    // Define tables and indexes
    // Indexes allow for fast querying (crucial for charts)
    this.version(1).stores({
      products: '++id, name, category, stock', 
      sales: '++id, productId, date, [date+productId]', 
      expenses: '++id, category, date'
    });
  }
}

export const db = new DokandarDB();
