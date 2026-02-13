import React, { createContext, useContext, ReactNode } from 'react';
import { db } from '../db/db';
import { Product, Sale, Expense, Customer, Staff, InventoryExpense, Supplier, PriceHistory, Payment } from '../types';

interface AppContextType {
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  
  addSale: (sale: Omit<Sale, 'id' | 'total' | 'profit'>) => Promise<void>;
  deleteSale: (id: number) => Promise<void>;
  
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (id: number) => Promise<void>;

  addInventoryExpense: (expense: Omit<InventoryExpense, 'id'>) => Promise<void>;

  addCustomer: (customer: Omit<Customer, 'id' | 'debt' | 'createdAt'>) => Promise<void>;
  updateCustomerDebt: (customerId: number, amount: number) => Promise<void>; 
  updateCustomer: (id: number, data: Partial<Customer>) => Promise<void>;

  addStaff: (staff: Omit<Staff, 'id' | 'active'>) => Promise<void>;

  addSupplier: (supplier: Omit<Supplier, 'id'>) => Promise<number>;
  getSuppliers: () => Promise<Supplier[]>;

  logPriceHistory: (productId: number, buyPrice: number, sellPrice: number) => Promise<void>;
  getLastPurchasePrice: (productId: number) => Promise<number | undefined>;
  
  recordPayment: (payment: Omit<Payment, 'id'>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

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

  const addSale = async (saleData: Omit<Sale, 'id' | 'total' | 'profit'>) => {
    if (saleData.quantity <= 0) throw new Error("Quantity must be positive");

    try {
      await db.transaction('rw', db.products, db.sales, db.customers, db.priceHistory, async () => {
        const product = await db.products.get(saleData.productId);
        if (!product) throw new Error("Product not found");
        if (product.stock < saleData.quantity) throw new Error(`Insufficient Stock. Available: ${product.stock}`);

        const total = saleData.sellPrice * saleData.quantity;
        const profit = (saleData.sellPrice - saleData.buyPrice) * saleData.quantity;

        // Update Stock
        await db.products.update(product.id!, { stock: product.stock - saleData.quantity, updatedAt: new Date() });
        
        // Save Sale (Unit is automatically included via ...saleData if passed)
        await db.sales.add({ ...saleData, total, profit });
        
        // Log Price History
        await db.priceHistory.add({
          productId: product.id!,
          buyPrice: saleData.buyPrice,
          sellPrice: saleData.sellPrice,
          date: new Date()
        });

        // Update Customer Debt if Credit Sale
        if (saleData.customerId) {
          const customer = await db.customers.get(saleData.customerId);
          if (customer) {
            await db.customers.update(customer.id!, { debt: customer.debt + total });
          }
        }
      });
    } catch (error) {
      throw error; 
    }
  };

  const deleteSale = async (id: number) => {
    try {
      const sale = await db.sales.get(id);
      if (!sale) throw new Error("Sale not found");
      await db.transaction('rw', db.products, db.sales, db.customers, async () => {
        const product = await db.products.get(sale.productId);
        if (product) await db.products.update(product.id!, { stock: product.stock + sale.quantity });
        await db.sales.delete(id);
      });
    } catch (error) { throw new Error("Could not delete sale."); }
  };

  const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
    try { await db.expenses.add({ ...expenseData, date: expenseData.date || new Date() }); } 
    catch (error) { throw new Error("Could not save expense."); }
  };
  
  const deleteExpense = async (id: number) => {
    try { await db.expenses.delete(id); } 
    catch (error) { throw new Error("Could not delete expense."); }
  };

  const addInventoryExpense = async (expenseData: Omit<InventoryExpense, 'id'>) => {
    try { await db.inventoryExpenses.add({ ...expenseData, date: expenseData.date || new Date() }); } 
    catch (error) { throw new Error("Could not save inventory expense."); }
  };

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

  const updateCustomer = async (id: number, data: Partial<Customer>) => {
    try { 
      await db.customers.update(id, data); 
    } catch (error) { 
      throw new Error("Could not update customer."); 
    }
  };

  const addStaff = async (staffData: Omit<Staff, 'id' | 'active'>) => {
    try { await db.staff.add({ ...staffData, active: true }); } 
    catch (error) { throw new Error("Could not add staff."); }
  };

  const addSupplier = async (supplierData: Omit<Supplier, 'id'>): Promise<number> => {
    try { 
      return (await db.suppliers.add(supplierData)) as number;
    } catch (error) { 
      throw new Error("Could not save supplier."); 
    }
  };

  const getSuppliers = async (): Promise<Supplier[]> => {
    return await db.suppliers.toArray();
  };

  const logPriceHistory = async (productId: number, buyPrice: number, sellPrice: number) => {
    try {
      await db.priceHistory.add({
        productId,
        buyPrice,
        sellPrice,
        date: new Date()
      });
    } catch (e) {
      console.error("Failed to log price history", e);
    }
  };

  const getLastPurchasePrice = async (productId: number): Promise<number | undefined> => {
    const history = await db.priceHistory
      .where('productId').equals(productId)
      .reverse()
      .first();
    return history?.buyPrice;
  };

  const recordPayment = async (paymentData: Omit<Payment, 'id'>) => {
    try {
      await db.transaction('rw', db.payments, db.customers, async () => {
        await db.payments.add({
          ...paymentData,
          date: paymentData.date || new Date()
        });

        const customer = await db.customers.get(paymentData.customerId);
        if (customer) {
          const newDebt = customer.debt - paymentData.amount; 
          if (newDebt < 0) throw new Error("Payment exceeds total debt");
          
          await db.customers.update(customer.id!, {
            debt: newDebt,
            lastPaymentDate: new Date()
          });
        }
      });
    } catch (error) {
      throw new Error("Could not record payment.");
    }
  };

  const value: AppContextType = {
    addProduct, updateProduct, deleteProduct,
    addSale, deleteSale,
    addExpense, deleteExpense,
    addInventoryExpense,
    addCustomer, updateCustomerDebt, updateCustomer,
    addStaff,
    addSupplier, getSuppliers,
    logPriceHistory, getLastPurchasePrice,
    recordPayment
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
