import React, { useState } from 'react';
import { Plus, Trash2, TrendingDown, Tag, Calendar } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import BottomSheet from '../ui/BottomSheet';
import Button from '../ui/Button';
import Card from '../ui/Card';
import AmountInput from '../ui/AmountInput';
import { formatCurrency, formatDate } from '../../lib/utils';

// Simple Category List for Expenses
const EXPENSE_CATEGORIES = [
  'Rent', 'Transport', 'Electricity', 'Salary', 'Inventory', 'Maintenance', 'Other'
];

const Expenses: React.FC = () => {
  const { t, lang } = useLanguage();
  const { addExpense, deleteExpense } = useApp();

  // State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState('Rent');
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Data
  const expenses = useLiveQuery(() => 
    db.expenses.orderBy('date').reverse().toArray()
  );

  // Handlers
  const resetForm = () => {
    setCategory('Rent');
    setAmount(0);
    setNote('');
  };

  const openModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return alert("Please enter a valid amount");

    setIsProcessing(true);
    try {
      await addExpense({
        category,
        amount,
        note,
        date: new Date()
      });
      closeModal();
    } catch (err) {
      alert("Failed to save expense");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(t('common.confirmDelete'))) {
      await deleteExpense(id);
    }
  };

  // Group expenses by date for better UI
  const groupedExpenses = expenses?.reduce((groups: Record<string, typeof expenses>, expense) => {
    const dateKey = new Date(expense.date).toDateString();
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(expense);
    return groups;
  }, {});

  return (
    <div className="pb-32 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-h1 text-prussian font-display">{t('expenses.title')}</h1>
        <button 
          onClick={openModal}
          className="flex items-center gap-2 bg-orange text-white px-4 py-2 rounded-md shadow-float active:scale-95 transition-transform"
        >
          <Plus size={18} /> <span className="font-semibold">{t('expenses.addExpense')}</span>
        </button>
      </div>

      {/* Expenses List */}
      <div className="space-y-6">
        {!expenses || expenses.length === 0 ? (
          <div className="text-center py-20">
            <TrendingDown size={40} className="mx-auto text-prussian/20 mb-2"/>
            <p className="text-secondary">{t('common.noData')}</p>
          </div>
        ) : (
          Object.entries(groupedExpenses || {}).map(([dateKey, items]) => (
            <div key={dateKey}>
              <h3 className="text-small font-semibold text-secondary uppercase tracking-wide mb-3 px-1">
                {formatDate(new Date(dateKey), lang)}
              </h3>
              <div className="space-y-2">
                {items.map(expense => (
                  <Card key={expense.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-50 rounded-md text-red-500">
                        <Tag size={16} />
                      </div>
                      <div>
                        <p className="font-semibold text-prussian">{expense.category}</p>
                        {expense.note && <p className="text-small text-secondary">{expense.note}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <p className="font-bold text-prussian text-lg">- {formatCurrency(expense.amount, lang)}</p>
                       <button 
                         onClick={() => handleDelete(expense.id!)}
                         className="p-2 text-red-400 hover:bg-red-50 rounded-full active:scale-90 transition-all"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Expense Bottom Sheet */}
      <BottomSheet 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={t('expenses.addExpense')}
        footer={
          <Button 
            onClick={handleSave} 
            isLoading={isProcessing}
            icon={<Plus size={20} />}
          >
            {t('common.save')}
          </Button>
        }
      >
        <div className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-small font-semibold mb-2 text-prussian">{t('expenses.category')}</label>
            <div className="flex flex-wrap gap-2">
              {EXPENSE_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    category === cat 
                      ? 'bg-orange text-white shadow-float' 
                      : 'bg-alabaster text-prussian hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <AmountInput 
            value={amount}
            onChange={setAmount}
            label={t('expenses.amount')}
          />

          {/* Note Input */}
          <div>
            <label className="block text-small font-semibold mb-2 text-prussian">{t('expenses.note')}</label>
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note..."
              className="w-full p-3 bg-white border border-gray-border rounded-md focus:ring-2 focus:ring-orange focus:outline-none min-h-[80px]"
            />
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};

export default Expenses;
