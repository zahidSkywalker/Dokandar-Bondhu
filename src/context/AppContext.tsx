import React, { createContext, useContext, ReactNode } from 'react';
import { db } from '../db/db';
import { 
  Product, 
  Sale, 
  Expense, 
  Customer, 
  Staff, 
  InventoryExpense, 
  MarketPrice, 
  Supplier, 
  StockPrediction 
} from '../types';

// Extended Context Interface
interface AppContextType {
  // --- Products ---
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  
  // --- Sales ---
  addSale: (sale: Omit<Sale, 'id' | 'total' | 'profit'>) => Promise<void>;
  deleteSale: (id: number) => Promise<void>;
  
  // --- Expenses ---
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (id: number) => Promise<void>;

  // --- NEW: Inventory Expenses ---
  addInventoryExpense: (expense: Omit<InventoryExpense, 'id'>) => Promise<void>;

  // --- NEW: Customers (Baki Khata) ---
  addCustomer: (customer: Omit<Customer, 'id' | 'debt' | 'createdAt'>) => Promise<void>;
  updateCustomerDebt: (customerId: number, amount: number) => Promise<void>;
  
  // --- NEW: Staff ---
  addStaff: (staff: Omit<Staff, 'id' | 'active'>) => Promise<void>;

  // --- NEW: Market Prices ---
  syncMarketPrices: (data: Omit<MarketPrice, 'id' | 'dateFetched'>[]) => Promise<void>;

  // --- NEW: Suppliers ---
  addSupplier: (supplier: Omit<Supplier, 'id'>) => Promise<void>;

  // --- NEW: Notification Trigger ---
  triggerNotification: (type: string, payload?: any) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  
  // --- Products (Existing) ---
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date();
      await db.products.add({ ...productData, createdAt: now, updatedAt: now });
    } catch (error) { throw new Error("Could not save product."); }
  };

  const updateProduct = async (id: number, updates: Partial<Product>) => {
    try { await db.products.update(id, { ...updates, updatedAt: new Date() }); } 
    catch (error) { throw new Error("Could not update product."); }
  };

  const deleteProduct = async (id: number) => {
    try { await db.products.delete(id); } 
    catch (error) { throw new Error("Could not delete product."); }
  };

  // --- Sales (Updated for Baki Khata) ---
  const addSale = async (saleData: Omit<Sale, 'id' | 'total' | 'profit'>) => {
    if (saleData.quantity <= 0) throw new Error("Quantity must be positive");

    try {
      await db.transaction('rw', db.products, db.sales, db.customers, async () => {
        const product = await db.products.get(saleData.productId);
        if (!product) throw new Error("Product not found");
        if (product.stock < saleData.quantity) throw new Error(`Insufficient Stock. Available: ${product.stock}`);

        const total = saleData.sellPrice * saleData.quantity;
        const profit = (saleData.sellPrice - saleData.buyPrice) * saleData.quantity;

        // Update Stock
        await db.products.update(product.id!, { stock: product.stock - saleData.quantity, updatedAt: new Date() });

        // Add Sale
        await db.sales.add({ ...saleData, total, profit });

        // Add Debt if Baki Khata (Customer Linked)
        if (saleData.customerId) {
          const customer = await db.customers.get(saleData.customerId);
          if (customer) {
            await db.customers.update(customer.id!, { debt: customer.debt + total });
          }
        }
      });
    } catch (error) { throw error; }
  };

  const deleteSale = async (id: number) => {
    try {
      const sale = await db.sales.get(id);
      if (!sale) throw new Error("Sale not found");
      await db.transaction('rw', db.products, db.sales, db.customers, async () => {
        const product = await db.products.get(sale.productId);
        if (product) await db.products.update(product.id!, { stock: product.stock + sale.quantity });
        // Reverse Debt (Optional logic)
        await db.sales.delete(id);
      });
    } catch (error) { throw new Error("Could not delete sale."); }
  };

  // --- Expenses (Existing) ---
  const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
    try { await db.expenses.add({ ...expenseData, date: expenseData.date || new Date() }); } 
    catch (error) { throw new Error("Could not save expense."); }
  };
  
  const deleteExpense = async (id: number) => {
    try { await db.expenses.delete(id); } 
    catch (error) { throw new Error("Could not delete expense."); }
  };

  // --- NEW: Inventory Expenses ---
  const addInventoryExpense = async (expenseData: Omit<InventoryExpense, 'id'>) => {
    try { await db.inventoryExpenses.add({ ...expenseData, date: expenseData.date || new Date() }); } 
    catch (error) { throw new Error("Could not save inventory expense."); }
  };

  // --- NEW: Customers (Baki Khata) ---
  const addCustomer = async (customerData: Omit<Customer, 'id' | 'debt' | 'createdAt'>) => {
    try { await db.customers.add({ ...customerData, debt: 0, createdAt: new Date() }); } 
    catch (error) { throw new Error("Could not save customer."); }
  };

  const updateCustomerDebt = async (customerId: number, amount: number) => {
    try {
      await db.transaction('rw', db.customers, async () => {
        const customer = await db.customers.get(customerId);
        if (customer) {
          const newDebt = customer.debt + amount;
          if (newDebt < 0) throw new Error("Payment exceeds debt");
          await db.customers.update(customer.id!, { 
            debt: newDebt,
            lastPaymentDate: amount < 0 ? new Date() : customer.lastPaymentDate
          });
        }
      });
    } catch (error) { throw new Error("Could not update debt."); }
  };

  // --- NEW: Staff ---
  const addStaff = async (staffData: Omit<Staff, 'id' | 'active'>) => {
    try { await db.staff.add({ ...staffData, active: true }); } 
    catch (error) { throw new Error("Could not add staff."); }
  };

  // --- NEW: Market Prices (Sync) ---
  const syncMarketPrices = async (data: Omit<MarketPrice, 'id' | 'dateFetched'>[]) => {
    try {
      const dataWithDate = data.map(item => ({ ...item, dateFetched: new Date() }));

      await db.transaction('rw', db.marketPrices, async () => {
        await db.marketPrices.clear(); // Clear old
        await db.marketPrices.bulkAdd(dataWithDate); // Add new
      });
    } catch (error) {
      throw new Error("Failed to sync market prices.");
    }
  };

  // --- NEW: Suppliers ---
  const addSupplier = async (supplierData: Omit<Supplier, 'id'>) => {
    try { await db.suppliers.add({ ...supplierData }); } 
    catch (error) { throw new Error("Could not add supplier."); }
  };

  // --- NEW: Notification Trigger ---
  const triggerNotification = async (type: string, payload?: any) => {
    console.log(`[AppContext] Triggered Notification: ${type}`, payload);
    // In a real app with a UI list, we would update a state here.
    // Since this is a conceptual "Serverless" PWA, we assume the UI listens to the hook `usePushNotifications`.
    // However, to keep the Context in charge of *dispatching*:
    // We just log it here for now, or could integrate with a local DB notification log if we had one.
    // The logic in `notificationScheduler.ts` calls this method.
  };

  const value: AppContextType = {
    addProduct, updateProduct, deleteProduct,
    addSale, deleteSale,
    addExpense, deleteExpense,
    addInventoryExpense,
    addCustomer, updateCustomerDebt,
    addStaff,
    syncMarketPrices,
    addSupplier,
    triggerNotification
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
