import React, { useState } from 'react';
import { Plus, Trash2, Receipt, ShoppingCart } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { formatCurrency, formatDate, toEnglishDigits } from '../../lib/utils';

const EXPENSE_CATEGORIES = ['Rent', 'Electricity', 'Transport', 'Withdrawal', 'Salary', 'Other'];
const INVENTORY_EXPENSE_CATEGORIES = ['Raw Material', 'Stock Purchase', 'Transport for Goods', 'Packaging', 'Other'];

const Expenses: React.FC = () => {
  const { t, lang } = useLanguage();
  const { addExpense, addInventoryExpense } = useApp();
  const [activeTab, setActiveTab] = useState<'general' | 'inventory'>('general');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ category: 'Rent', amount: '', note: '', desc: '' });

  const expenses = useLiveQuery(() => db.expenses.orderBy('date').reverse().limit(30).toArray());
  const inventoryExpenses = useLiveQuery(() => db.inventoryExpenses.orderBy('date').reverse().limit(30).toArray());

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === 'general') {
        await addExpense({ category: formData.category, amount: parseFloat(toEnglishDigits(formData.amount)), note: formData.note, date: new Date() });
      } else {
        await addInventoryExpense({ description: formData.desc || formData.category, amount: parseFloat(toEnglishDigits(formData.amount)), date: new Date() });
      }
      setIsModalOpen(false);
      setFormData({ category: 'Rent', amount: '', note: '', desc: '' });
    } catch (err) { alert("Error saving expense"); }
  };

  const handleDelete = async (type: 'general' | 'inventory', id?: number) => {
    if (!id) return;
    if (confirm(t('common.confirmDelete'))) {
        if (type === 'general') await db.expenses.delete(id);
        else await db.inventoryExpenses.delete(id);
    }
  };

  const list = activeTab === 'general' ? expenses : inventoryExpenses;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-prussian font-display">{t('expenses.title')}</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-red-500 text-white p-3 rounded-2xl shadow-xl active:scale-95 transition-transform"><Plus size={24} /></button>
      </div>

      {/* Tabs */}
      <div className="p-1 rounded-xl bg-white flex border border-gray-100 shadow-sm">
        <button onClick={() => setActiveTab('general')} className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all ${activeTab === 'general' ? 'bg-orange text-prussian shadow-md' : 'text-prussian/50'}`}>General</button>
        <button onClick={() => setActiveTab('inventory')} className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all ${activeTab === 'inventory' ? 'bg-orange text-prussian shadow-md' : 'text-prussian/50'}`}>Inventory</button>
      </div>

      <div className="space-y-3">
        {!list ? <div className="text-center p-8">Loading...</div> : list.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-2xl border border-gray-100">
             <Receipt className="mx-auto text-prussian/20 mb-3" size={48} />
             <p className="text-prussian/50">No records</p>
          </div>
        ) : (
          list.map((item: any, i) => (
            <div 
                key={item.id} 
                className="group p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:border-orange/30 stagger-item"
                style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className={`p-3 rounded-xl shrink-0 ${activeTab === 'general' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                {activeTab === 'general' ? <Receipt size={20} /> : <ShoppingCart size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold truncate text-prussian">
                    {activeTab === 'general' ? item.category : item.description}
                </h3>
                <span className="text-[10px] text-prussian/50">{formatDate(item.date, lang)}</span>
              </div>
              <div className="flex flex-col items-end justify-between gap-2">
                  <p className="text-xl font-bold text-prussian">- {formatCurrency(item.amount, lang)}</p>
                  <button onClick={() => handleDelete(activeTab, item.id)} className="text-xs text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={activeTab === 'general' ? t('expenses.addExpense') : 'Add Inventory Cost'}>
        <form onSubmit={handleAdd} className="space-y-2">
          {activeTab === 'general' ? (
            <>
              <label className="block text-sm font-bold mb-1 text-prussian">{t('expenses.category')}</label>
              <select className="w-full mb-2 px-4 py-3 rounded-xl bg-white border border-gray-200 text-prussian" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <Input label="Note" value={formData.note} onChange={(e) => setFormData({...formData, note: e.target.value})} />
            </>
          ) : (
            <>
              <label className="block text-sm font-bold mb-1 text-prussian">Expense Type</label>
              <select className="w-full mb-2 px-4 py-3 rounded-xl bg-white border border-gray-200 text-prussian" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                {INVENTORY_EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <Input label="Description" placeholder="e.g. Buying 10kg Rice" value={formData.desc} onChange={(e) => setFormData({...formData, desc: e.target.value})} />
            </>
          )}
          <Input label="Amount" type="number" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
          <div className="h-6" />
          <Button variant="danger" icon={<Plus size={20}/>}>Save Expense</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Expenses;
