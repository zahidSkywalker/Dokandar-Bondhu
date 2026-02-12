import React, { useState } from 'react';
import { Plus, Trash2, Receipt, ShoppingCart, Package, ArrowDownCircle } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { formatCurrency, formatDate, toEnglishDigits } from '../../lib/utils';

const EXPENSE_CATEGORIES = ['Rent', 'Electricity', 'Transport', 'Withdrawal', 'Salary', 'Other'];
const INVENTORY_EXPENSE_CATEGORIES = ['Raw Material', 'Stock Purchase', 'Transport for Goods', 'Packaging', 'Other'];

const Expenses: React.FC = () => {
  const { t, lang } = useLanguage();
  const { theme } = useTheme();
  const { addExpense, addInventoryExpense, deleteExpense } = useApp();
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
        if (type === 'general') {
            await db.expenses.delete(id);
        } else {
            await db.inventoryExpenses.delete(id);
        }
    }
  };

  const renderList = (type: 'general' | 'inventory') => {
    const list = type === 'general' ? expenses : inventoryExpenses;
    if (!list) return <p className="text-center p-8">Loading...</p>;
    if (list.length === 0) return (
        <div className={`p-10 text-center rounded-2xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
            <Receipt className="mx-auto text-earth-200 mb-3 dark:text-gray-600" size={48} />
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-earth-400'}`}>No records</p>
        </div>
    );

    return (
        <div className="space-y-3">
          {list.map((item: any) => (
            <div 
                key={item.id} 
                className={`group p-4 rounded-2xl border shadow-sm flex items-center gap-4 transition-all hover:shadow-md ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}
            >
              {/* Icon */}
              <div className={`p-3 rounded-xl shrink-0 ${type === 'general' ? 'bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400' : 'bg-blue-50 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400'}`}>
                {type === 'general' ? <Receipt size={20} /> : <ShoppingCart size={20} />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>
                        {type === 'general' ? item.category : item.description}
                    </h3>
                </div>
                <div className="flex items-center gap-3">
                     <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                         type === 'general' 
                         ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                         : 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                     }`}>
                        {type === 'general' ? 'OpEx' : 'Inventory'}
                     </span>
                     <span className={`text-[10px] ${theme === 'dark' ? 'text-gray-500' : 'text-earth-400'}`}>
                        {formatDate(item.date, lang)}
                     </span>
                     {item.note && <span className={`text-[10px] italic truncate ${theme === 'dark' ? 'text-gray-500' : 'text-earth-400'}`}>{item.note}</span>}
                </div>
              </div>

              {/* Amount & Actions */}
              <div className="flex flex-col items-end justify-between h-full gap-2">
                  <p className={`text-xl font-bold shrink-0 ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>
                      - {formatCurrency(item.amount, lang)}
                  </p>
                  <button 
                    onClick={() => handleDelete(type, item.id)} 
                    className={`opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg text-xs ${theme === 'dark' ? 'bg-gray-700 text-red-400 hover:bg-gray-600' : 'bg-red-50 text-red-500 hover:bg-red-100'}`}
                  >
                      <Trash2 size={14} />
                  </button>
              </div>
            </div>
        ))}
      </div>
    );
  };

  return (
    <div className="pb-24 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6 mt-2">
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>{t('expenses.title')}</h1>
        <button onClick={() => setIsModalOpen(true)} className={`p-3 rounded-2xl shadow-xl active:scale-95 transition-transform ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-red-500 text-white'}`}><Plus size={24} /></button>
      </div>

      {/* Tabs */}
      <div className={`p-1 rounded-xl mb-6 flex ${theme === 'dark' ? 'bg-gray-800' : 'bg-cream-100'}`}>
        <button onClick={() => setActiveTab('general')} className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all ${activeTab === 'general' ? (theme === 'dark' ? 'bg-gray-600 text-white shadow' : 'bg-white text-earth-900 shadow-sm') : (theme === 'dark' ? 'text-gray-400' : 'text-earth-600')}`}>General</button>
        <button onClick={() => setActiveTab('inventory')} className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all ${activeTab === 'inventory' ? (theme === 'dark' ? 'bg-gray-600 text-white shadow' : 'bg-white text-earth-900 shadow-sm') : (theme === 'dark' ? 'text-gray-400' : 'text-earth-600')}`}>Inventory</button>
      </div>

      {renderList(activeTab)}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={activeTab === 'general' ? t('expenses.addExpense') : 'Add Inventory Cost'}>
        <form onSubmit={handleAdd} className="space-y-2">
          {activeTab === 'general' ? (
            <>
              <label className={`block text-sm font-bold mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-earth-700'}`}>{t('expenses.category')}</label>
              <select className={`w-full mb-2 px-4 py-3 rounded-xl ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-cream-200 text-earth-800'}`} value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <Input label="Note" value={formData.note} onChange={(e) => setFormData({...formData, note: e.target.value})} />
            </>
          ) : (
            <>
              <label className={`block text-sm font-bold mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-earth-700'}`}>Expense Type</label>
              <select className={`w-full mb-2 px-4 py-3 rounded-xl ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-cream-200 text-earth-800'}`} value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
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
