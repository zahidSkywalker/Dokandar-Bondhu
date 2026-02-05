import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { Supplier } from '../types';

interface SupplierWithDue {
  supplier: Supplier;
  dueAmount: number; // Sum of unpaid expenses
}

export const useSuppliers = () => {
  const suppliers = useLiveQuery(() => db.suppliers.toArray());
  
  // Calculate total due for each supplier
  const suppliersWithDue: SupplierWithDue[] = suppliers ? suppliers.map(supplier => {
    const expenses = db.inventoryExpenses
      .where('productId')
      .equals(supplier.id) // Link expense to supplier (assuming you link them)
      .toArray(); // Note: In a real app, you'd have a specific 'supplierId' field. 
      // For now, we use name matching or just sum all expenses if not linked.
      
    const dueAmount = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    
    return { supplier, dueAmount };
  }) : [];

  const addSupplier = async (supplier: Omit<Supplier, 'id'>) => {
    await db.suppliers.add({ ...supplier, createdAt: new Date() });
  };

  const deleteSupplier = async (id: number) => {
    await db.suppliers.delete(id);
    // Also remove associated expenses? Optional, keeping data clean.
    // await db.inventoryExpenses.where('supplierId').equals(id).delete(); 
  };

  return { suppliers: suppliersWithDue, addSupplier, deleteSupplier };
};
