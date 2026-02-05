import React, { useState } from 'react';
import { Plus, Trash2, Receipt, ShoppingCart, Package } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { formatCurrency, formatDate, toEnglishDigits } from '../../lib/utils';

const EXPENSE_CATEGORIES = ['Rent', 'Electricity', 'Transport', 'Withdrawal', 'Other'];
const INVENTORY_EXPENSE_CATEGORIES = ['Raw Material', 'Transport for Goods', 'Packaging', 'Other'];

const Expenses: React.FC = () => {
  const { t, lang } = useLanguage();
  const { addExpense, addInventoryExpense } = useApp();
  const [activeTab, setActiveTab] = useState<'general' | 'inventory'>('general');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ category: 'Rent', amount: '', note: '', desc: '' });

  const expenses = useLiveQuery(() => db.expenses.orderBy('date').reverse().limit(20).toArray());
  const inventoryExpenses = useLiveQuery(() => db.inventoryExpenses.orderBy('date').reverse().limit(20).toArray());

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

  const renderList = (type: 'general' | 'inventory') => {
    const list = type === 'general' ? expenses : inventoryExpenses;
    if (!list) return <p className="text-center text-slate-500 mt-10">Loading...</p>;
    if (list.length === 0) return <p className="text-center text-slate-400 mt-10">No records</p>;

    return list.map((item: any) => (
      <div key={item.id} className={`
        p-4 rounded-xl border shadow-sm flex justify-between items-center mb-3
        ${type === 'general' 
          ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800' 
          : 'bg-blue-50/30 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30'}
      `}>
        <div className="flex items-center gap-4">
          <div className={`p-2.5 rounded-xl ${
            type === 'general' 
              ? 'bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400' 
              : 'bg-blue-50 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400'
          }`}>
            {type === 'general' ? <Receipt size={20} /> : <ShoppingCart size={20} />}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wide ${
                type === 'general' 
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                  : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
                {type === 'general' ? item.category : 'Inventory'}
              </span>
            </div>
            {item.note && <p className="text-xs text-slate-500 dark:text-slate-400">{item.note || item.description}</p>}
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{formatDate(item.date, lang)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
             <p className="font-bold text-lg text-slate-800 dark:text-white">- {formatCurrency(item.amount, lang)}</p>
          </div>
          <button onClick={() => {/* Implement delete */}} className="p-3 rounded-xl transition-colors text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-red-500">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="pb-24 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6 mt-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('expenses.title')}</h1>
        <button onClick={() => setIsModalOpen(true)} className="p-3 rounded-2xl shadow-lg shadow-red-500/10 active:scale-95 transition-transform bg-red-500 text-white"><Plus size={24} /></button>
      </div>

      {/* Tabs */}
      <div className="p-1 rounded-xl mb-4 flex bg-slate-100 dark:bg-slate-800">
        <button onClick={() => setActiveTab('general')} className={`
          flex-1 py-2.5 text-xs font-bold rounded-lg transition-all
          ${activeTab === 'general' 
            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}
        `}>General</button>
        <button onClick={() => setActiveTab('inventory')} className={`
          flex-1 py-2.5 text-xs font-bold rounded-lg transition-all
          ${activeTab === 'inventory' 
            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}
        `}>Inventory</button>
      </div>

      <div className="space-y-0">
        {renderList(activeTab)}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={activeTab === 'general' ? t('expenses.addExpense') : 'Add Inventory Cost'}>
        <form onSubmit={handleAdd} className="space-y-2">
          {activeTab === 'general' ? (
            <>
              <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">{t('expenses.category')}</label>
              <select className="w-full mb-5 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <Input label="Note" value={formData.note} onChange={(e) => setFormData({...formData, note: e.target.value})} />
            </>
          ) : (
            <>
              <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Expense Type</label>
              <select className="w-full mb-5 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                {INVENTORY_EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <Input label="Description" placeholder="e.g. Buying 10kg Rice" value={formData.desc} onChange={(e) => setFormData({...formData, desc: e.target.value})} />
            </>
          )}
          <Input label="Amount" type="number" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
          <div className="h-6" />
          <Button variant="danger" icon={<Plus size={20}/>}>Save</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Expenses;
