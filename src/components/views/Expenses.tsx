import React, { useState } from 'react';
import { Plus, Trash2, Receipt, ShoppingCart, Package } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { formatCurrency, formatDate, toEnglishDigits } from '../../lib/utils';

const EXPENSE_CATEGORIES = ['Rent', 'Electricity', 'Transport', 'Withdrawal', 'Other'];
const INVENTORY_EXPENSE_CATEGORIES = ['Raw Material', 'Transport for Goods', 'Packaging', 'Other'];

const Expenses: React.FC = () => {
  const { t, lang } = useLanguage();
  const { theme } = useTheme();
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
    if (!list) return <p>Loading...</p>;
    if (list.length === 0) return <p className="text-center text-gray-400 mt-10">No records</p>;

    return list.map((item: any) => (
      <div key={item.id} className={`p-5 rounded-2xl border shadow-sm flex justify-between items-center ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-xl ${type === 'general' ? 'bg-red-50 text-red-500 dark:bg-red-900/20' : 'bg-blue-50 text-blue-500 dark:bg-blue-900/20'}`}>
            {type === 'general' ? <Receipt size={20} /> : <ShoppingCart size={20} />}
          </div>
          <div>
            <div className={`flex items-center gap-2 mb-1`}>
              <span className={`bg-${type === 'general' ? 'red' : 'blue'}-50 text-${type === 'general' ? 'red' : 'blue'}-600 dark:bg-${type === 'general' ? 'red' : 'blue'}-900/20 dark:text-${type === 'general' ? 'red' : 'blue'}-400 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wide`}>
                {type === 'general' ? item.category : 'Inventory'}
              </span>
            </div>
            {item.note && <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-earth-500'}`}>{item.note || item.description}</p>}
            <p className={`text-[10px] ${theme === 'dark' ? 'text-gray-500' : 'text-earth-400'}`}>{formatDate(item.date, lang)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
             <p className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-earth-800'}`}>- {formatCurrency(item.amount, lang)}</p>
          </div>
          <button onClick={() => {/* Implement delete based on type */}} className={`p-3 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'bg-cream-50 hover:bg-red-50 hover:text-red-500 text-earth-400'}`}>
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="pb-24 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4 mt-2">
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>{t('expenses.title')}</h1>
        <button onClick={() => setIsModalOpen(true)} className={`p-3 rounded-2xl shadow-xl active:scale-95 transition-transform ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-red-500 text-white'}`}><Plus size={24} /></button>
      </div>

      {/* Tabs */}
      <div className={`p-1 rounded-xl mb-4 flex ${theme === 'dark' ? 'bg-gray-800' : 'bg-cream-100'}`}>
        <button onClick={() => setActiveTab('general')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'general' ? (theme === 'dark' ? 'bg-gray-600 text-white shadow' : 'bg-white text-earth-900 shadow-sm') : (theme === 'dark' ? 'text-gray-400' : 'text-earth-600')}`}>General</button>
        <button onClick={() => setActiveTab('inventory')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'inventory' ? (theme === 'dark' ? 'bg-gray-600 text-white shadow' : 'bg-white text-earth-900 shadow-sm') : (theme === 'dark' ? 'text-gray-400' : 'text-earth-600')}`}>Inventory</button>
      </div>

      <div className="space-y-4">
        {renderList(activeTab)}
      </div>

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
          <Button variant="danger" icon={<Plus size={20}/>}>Save</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Expenses;
