import React, { useState } from 'react';
import { Plus, Trash2, Receipt } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { formatCurrency, formatDate, toEnglishDigits } from '../../lib/utils';

const EXPENSE_CATEGORIES = ['Rent', 'Electricity', 'Transport', 'Withdrawal', 'Other'];

const Expenses: React.FC = () => {
  const { t, lang } = useLanguage();
  const { addExpense, deleteExpense } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ category: 'Rent', amount: '', note: '' });

  const expenses = useLiveQuery(() => db.expenses.orderBy('date').reverse().limit(20).toArray());

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addExpense({
        category: formData.category,
        amount: parseFloat(toEnglishDigits(formData.amount)),
        note: formData.note,
        date: new Date()
      });
      setIsModalOpen(false);
      setFormData({ category: 'Rent', amount: '', note: '' });
    } catch (err) {
      alert("Error saving expense");
    }
  };

  return (
    <div className="pb-24 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6 mt-2">
        <h1 className="text-2xl font-bold text-earth-900">{t('expenses.title')}</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-500 text-white p-3 rounded-2xl shadow-xl shadow-red-500/30 active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-4">
        {!expenses ? <p>Loading...</p> : expenses.length === 0 ? <p className="text-center text-earth-400 mt-10">No expenses recorded</p> : (
          expenses.map((exp) => (
            <div key={exp.id} className="bg-white p-5 rounded-2xl border border-cream-200 shadow-sm flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="bg-red-50 p-2 rounded-xl text-red-500">
                  <Receipt size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-cream-100 text-earth-600 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wide">{exp.category}</span>
                  </div>
                  {exp.note && <p className="text-xs text-earth-500 mt-1">{exp.note}</p>}
                  <p className="text-[10px] text-earth-400 mt-1">{formatDate(exp.date, lang)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                   <p className="font-bold text-xl text-earth-800">- {formatCurrency(exp.amount, lang)}</p>
                </div>
                <button onClick={() => deleteExpense(exp.id!)} className="bg-cream-50 hover:bg-red-50 hover:text-red-500 text-earth-400 p-3 rounded-xl transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('expenses.addExpense')}>
        <form onSubmit={handleAdd} className="space-y-2">
          <label className="block text-sm font-bold text-earth-700 mb-1">{t('expenses.category')}</label>
          <select 
            className="w-full mb-2 px-4 py-3 bg-white border border-cream-200 rounded-xl"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          
          <Input 
            label={t('expenses.amount')} 
            type="number" 
            required 
            value={formData.amount} 
            onChange={(e) => setFormData({...formData, amount: e.target.value})} 
          />
          <Input 
            label={t('expenses.note')} 
            value={formData.note} 
            onChange={(e) => setFormData({...formData, note: e.target.value})} 
          />
          <div className="h-6" />
          <Button variant="danger" icon={<Plus size={20}/>}>{t('common.save')}</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Expenses;
