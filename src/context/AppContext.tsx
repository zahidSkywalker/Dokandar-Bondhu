import React, { createContext, useContext, ReactNode } from 'react';
import { db } from '../db/db';
import { Product, Sale, Expense } from '../types';

interface AppContextType {
  // Products
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  
  // Sales
  addSale: (sale: Omit<Sale, 'id' | 'total' | 'profit'>) => Promise<void>;
  deleteSale: (id: number) => Promise<void>;
  
  // Expenses
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (id: number) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  // --- Product Actions ---

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date();
      await db.products.add({
        ...productData,
        createdAt: now,
        updatedAt: now
      });
    } catch (error) {
      console.error("Failed to add product:", error);
      throw new Error("Could not save product. Check storage permissions.");
    }
  };

  const updateProduct = async (id: number, updates: Partial<Product>) => {
    try {
      await db.products.update(id, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Failed to update product:", error);
      throw new Error("Could not update product.");
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      // Check if product has sales history? For simplicity, we allow delete but in real app might warn.
      await db.products.delete(id);
    } catch (error) {
      console.error("Failed to delete product:", error);
      throw new Error("Could not delete product.");
    }
  };

  // --- Sales Actions (Critical Business Logic) ---

  const addSale = async (saleData: Omit<Sale, 'id' | 'total' | 'profit'>) => {
    // 1. Validate input
    if (saleData.quantity <= 0) throw new Error("Quantity must be positive");

    try {
      // 2. Perform Transaction: We must update Sales AND Product stock atomically.
      await db.transaction('rw', db.products, db.sales, async () => {
        const product = await db.products.get(saleData.productId);
        
        if (!product) {
          throw new Error("Product not found");
        }

        if (product.stock < saleData.quantity) {
          throw new Error(`Insufficient Stock. Available: ${product.stock}`);
        }

        const total = saleData.sellPrice * saleData.quantity;
        const profit = (saleData.sellPrice - saleData.buyPrice) * saleData.quantity;

        // Update Product Stock
        await db.products.update(product.id!, { 
          stock: product.stock - saleData.quantity,
          updatedAt: new Date()
        });

        // Add Sale Record
        await db.sales.add({
          ...saleData,
          total,
          profit
        });
      });
    } catch (error) {
      console.error("Transaction failed:", error);
      // Re-throw to let the UI show the specific error (e.g., "Insufficient Stock")
      throw error; 
    }
  };

  const deleteSale = async (id: number) => {
    try {
      const sale = await db.sales.get(id);
      if (!sale) throw new Error("Sale not found");

      // Rollback stock logic
      await db.transaction('rw', db.products, db.sales, async () => {
        const product = await db.products.get(sale.productId);
        if (product) {
          await db.products.update(product.id!, {
            stock: product.stock + sale.quantity
          });
        }
        await db.sales.delete(id);
      });
    } catch (error) {
      console.error("Failed to delete sale:", error);
      throw new Error("Could not delete sale.");
    }
  };

  // --- Expense Actions ---

  const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
    try {
      await db.expenses.add({
        ...expenseData,
        date: expenseData.date || new Date() // Default to now if not provided
      });
    } catch (error) {
      console.error("Failed to add expense:", error);
      throw new Error("Could not save expense.");
    }
  };

  const deleteExpense = async (id: number) => {
    try {
      await db.expenses.delete(id);
    } catch (error) {
      console.error("Failed to delete expense:", error);
      throw new Error("Could not delete expense.");
    }
  };

  const value: AppContextType = {
    addProduct,
    updateProduct,
    deleteProduct,
    addSale,
    deleteSale,
    addExpense,
    deleteExpense
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
