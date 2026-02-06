import React, { useState } from 'react';
import { Plus, User, Phone, MapPin, Wallet, RefreshCw, AlertTriangle, Edit3, Trash2, List, ChevronRight, CreditCard, CheckCircle } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { formatCurrency } from '../../lib/utils';

const Ledger: React.FC = () => {
  const { t, lang } = useLanguage();
  const { theme } = useTheme();
  const { addCustomer, updateCustomerDebt, updateCustomer, deleteProduct } = useApp();
  
  // UI States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false); // For Editing/Deleting Debtor
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  
  // Form States
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', notes: '' });
  const [paymentAmount, setPaymentAmount] = useState('');

  // Data State
  const customers = useLiveQuery(() => db.customers.orderBy('debt').reverse().toArray());
  
  // Action Handlers
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCustomer(formData);
      setIsAddModalOpen(false);
      setFormData({ name: '', phone: '', address: '', notes: '' });
    } catch (err: any) { 
      alert("Error adding customer");
    }
  };

  const handleUpdateDebtor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    try {
      await updateCustomer(selectedCustomer.id, { 
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        notes: formData.notes 
      });
      setIsManageModalOpen(false);
      setFormData({ name: '', phone: '', address: '', notes: '' });
    } catch (err: any) { 
      alert("Error updating customer");
    }
  };

  const handleDeleteDebtor = async () => {
    if (confirm("Are you sure you want to delete this debtor? This action cannot be undone.")) {
      // Since we don't have a deleteCustomer method exported, we use the DB directly
      if (selectedCustomer?.id) {
        await db.customers.delete(selectedCustomer.id);
        setIsManageModalOpen(false);
        setSelectedCustomer(null);
      }
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    try {
      const amount = parseFloat(paymentAmount);
      await updateCustomerDebt(selectedCustomer.id, -amount); // Negative amount = Payment
      setIsPaymentModalOpen(false);
      setPaymentAmount('');
      setSelectedCustomer(null);
    } catch (err: any) { 
      alert("Error processing payment");
    }
  };

  const openManageModal = (customer: any) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone || '',
      address: customer.address || '',
      notes: customer.notes || ''
    });
    setIsManageModalOpen(true);
  };

  const openPaymentModal = (customer: any) => {
    setSelectedCustomer(customer);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className={`pb-24 max-w-2xl mx-auto ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-cream-50 text-earth-900'}`}>
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 mt-2">
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>{t('ledger.title')}</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className={`p-3 rounded-2xl shadow-xl active:scale-95 transition-transform ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-earth-800 text-white'}`}
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Customer List */}
      <div className="space-y-4">
        {!customers ? <div className="p-4 text-center">Loading...</div> : customers.length === 0 ? (
          <p className={`text-center mt-10 ${theme === 'dark' ? 'text-gray-400' : 'text-earth-400'}`}>No customers yet. Add one to start.</p>
        ) : (
          customers.map((customer) => (
            <div key={customer.id} className={`p-5 rounded-2xl border shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
              
              {/* Info Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-gray-700 text-earth-600' : 'bg-earth-50 text-earth-600'}`}>
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>{customer.name}</h3>
                    {customer.phone && (
                      <p className={`text-xs flex items-center gap-1 ${theme === 'dark' ? 'text-gray-400' : 'text-earth-500'}`}>
                        <Phone size={12}/> {customer.phone}
                      </p>
                    )}
                    {customer.address && (
                      <p className={`text-xs flex items-center gap-1 ${theme === 'dark' ? 'text-gray-400' : 'text-earth-500'}`}>
                        <MapPin size={12}/> {customer.address}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Total Due Badge */}
                <div className={`px-3 py-1.5 rounded-lg font-bold text-sm ${customer.debt > 0 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>
                  {customer.debt > 0 ? 'Due' : 'Cleared'}
                </div>
              </div>
              
              {/* Stats Row */}
              <div className={`flex justify-between items-center p-3 rounded-xl mb-3 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-earth-50'}`}>
                 <span className={`text-xs font-bold uppercase ${theme === 'dark' ? 'text-gray-400' : 'text-earth-500'}`}>{t('ledger.debt')}</span>
                 <span className={`font-bold ${customer.debt > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                   {formatCurrency(customer.debt || 0, lang)}
                 </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                
                {/* Manage Debtor (Edit/Delete) */}
                <button 
                   onClick={() => openManageModal(customer)}
                   className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                >
                   <Edit3 size={12}/> Manage
                </button>

                {/* Record Payment */}
                {customer.debt > 0 && (
                  <button 
                    onClick={() => openPaymentModal(customer)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900 hover:bg-green-100 transition-colors flex items-center justify-center gap-1"
                  >
                    <Wallet size={12}/> Pay Due
                  </button>
                )}

                {/* View Statement (History) */}
                <button 
                   onClick={() => {/* We'll reuse existing logic if needed, or just add as a button for now */}
                   console.log('Open Statement')} 
                   className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                >
                   <List size={12}/> History
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 1. Add Customer Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={t('ledger.addCustomer')}>
        <form onSubmit={handleAdd} className="space-y-2">
          <Input label={t('ledger.name')} required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <Input label={t('ledger.phone')} type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          <Input label={t('ledger.address')} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
          <Input label="Notes (Optional)" placeholder="Address, references, or credit warnings..." value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
          <div className="h-6" />
          <Button icon={<Plus size={20}/>}>Save Customer</Button>
        </form>
      </Modal>

      {/* 2. Manage Debtor Modal (Edit/Delete) */}
      <Modal isOpen={isManageModalOpen} onClose={() => setIsManageModalOpen(false)} title="Manage Debtor">
        <form onSubmit={handleUpdateDebtor} className="space-y-2">
           <div className="mb-4">
             <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Customer</label>
             <input disabled value={selectedCustomer?.name} className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded text-gray-500 dark:text-gray-400" />
           </div>
          <Input label="Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <Input label={t('ledger.phone')} type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          <Input label={t('ledger.address')} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
          <Input label="Notes" placeholder="Address, references, or credit warnings..." value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
          <div className="h-6" />
          <div className="grid grid-cols-2 gap-2">
             <Button icon={<Edit3 size={20} />}>Update Info</Button>
             <button 
                type="button"
                onClick={handleDeleteDebtor}
                className="bg-red-500 text-white hover:bg-red-600 transition-colors rounded-xl px-4 py-3 font-bold text-xs"
             >
                <Trash2 size={18} className="inline mr-2" /> Remove
             </button>
          </div>
        </form>
      </Modal>

      {/* 3. Payment Modal */}
      <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} title="Record Payment">
        <form onSubmit={handlePayment} className="space-y-2">
          <div className={`p-4 rounded-xl mb-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-cream-100'}`}>
            <p className="text-xs uppercase font-bold text-earth-500 dark:text-gray-400 mb-1">{t('ledger.debt')}</p>
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>
              {formatCurrency(selectedCustomer?.debt || 0, lang)}
            </p>
          </div>
          <Input label="Payment Amount" type="number" required value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
          <div className="h-6" />
          <Button variant="success" icon={<CheckCircle size={20}/>}>Confirm Payment</Button>
        </form>
      </Modal>

    </div>
  );
};

export default Ledger;
