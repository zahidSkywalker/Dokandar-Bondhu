import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
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
    <div className="pb-24 px-4 pt-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t('expenses.title')}</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-500 text-white p-3 rounded-full shadow-lg active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-3">
        {!expenses ? <p>Loading...</p> : expenses.length === 0 ? <p>No expenses recorded</p> : (
          expenses.map((exp) => (
            <div key={exp.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-bold uppercase">{exp.category}</span>
                </div>
                {exp.note && <p className="text-xs text-gray-500 mt-1">{exp.note}</p>}
                <p className="text-[10px] text-gray-400 mt-1">{formatDate(exp.date, lang)}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                   <p className="font-bold text-gray-800">- {formatCurrency(exp.amount, lang)}</p>
                </div>
                <button onClick={() => deleteExpense(exp.id!)} className="text-gray-400 hover:text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('expenses.addExpense')}>
        <form onSubmit={handleAdd}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('expenses.category')}</label>
          <select 
            className="w-full mb-4 px-4 py-3 bg-white border border-gray-300 rounded-lg"
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
          <div className="h-4" />
          <Button variant="danger">{t('common.save')}</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Expenses;
