import React, { useState } from 'react';
import { Plus, User, Phone, MapPin, CheckCircle, Wallet, RefreshCw, AlertTriangle, Edit3, List } from 'lucide-react';
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
  const { addCustomer, updateCustomerDebt, updateCustomer } = useApp();
  
  // UI States
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = React.useState(false); // NEW
  const [selectedCustomer, setSelectedCustomer] = React.useState<any>(null);
  const [editingCustomer, setEditingCustomer] = React.useState<any>(null);
  const [customerHistory, setCustomerHistory] = React.useState<any[]>([]); // NEW
  const [paymentAmount, setPaymentAmount] = React.useState('');  
  const [formData, setFormData] = React.useState({ name: '', phone: '', address: '' });
  
  // Data State
  const customers = useLiveQuery(() => db.customers.orderBy('debt').reverse().toArray(), []);

  // NEW: Fetch Transaction History for selected customer
  const fetchCustomerHistory = async (customer: any) => {
    setSelectedCustomer(customer);
    
    // Fetch Sales linked to this customer
    const sales = await db.sales.where('customerId').equals(customer.id).reverse().toArray();
    
    // Fetch Payments (this is tricky because we store payment amount in updateCustomerDebt, but we can infer it via a separate logic or just show Sales for now. 
    // To be simple: We will show the list of Sales associated with this customer.
    setCustomerHistory(sales);
    setIsHistoryModalOpen(true);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCustomer(formData);
      setIsModalOpen(false);
      setFormData({ name: '', phone: '', address: '' });
    } catch (err: any) { 
      alert("Error adding customer");
    }
  };

  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCustomer(editingCustomer.id, { notes: editingCustomer.notes });
      setIsEditModalOpen(false);
      setEditingCustomer(null);
    } catch (err: any) { 
      alert("Error updating customer");
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    try {
      const amount = parseFloat(paymentAmount);
      await updateCustomerDebt(selectedCustomer.id, -amount);
      setIsPayModalOpen(false);
      setPaymentAmount('');
      setSelectedCustomer(null);
    } catch (err: any) { 
      alert("Error processing payment");
    }
  };

  return (
    <div className={`pb-24 max-w-2xl mx-auto ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-cream-50 text-earth-900'}`}>
      
      <div className="flex justify-between items-center mb-6 mt-2">
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>{t('ledger.title')}</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className={`p-3 rounded-2xl shadow-xl active:scale-95 transition-transform ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-earth-800 text-white'}`}
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-4">
        {!customers ? <div className="p-4 text-center">Loading...</div> : customers.length === 0 ? (
          <p className={`text-center mt-10 ${theme === 'dark' ? 'text-gray-400' : 'text-earth-400'}`}>No customers yet. Add one to start.</p>
        ) : (
          customers.map((customer) => (
            <div key={customer.id} className={`p-5 rounded-2xl border shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
              
              {/* Info Section */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-earth-50 text-earth-600'}`}>
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>{customer.name}</h3>
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
                    {customer.notes && (
                       <p className={`text-xs mt-1 italic text-gray-500 truncate max-w-[200px]`}>
                         "{customer.notes}"
                       </p>
                    )}
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-lg font-bold text-sm ${customer.debt > 0 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>
                  {customer.debt > 0 ? 'Due' : 'Cleared'}
                </div>
              </div>
              
              {/* Total Debt */}
              <div className={`flex justify-between items-center p-3 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-earth-50'}`}>
                 <span className={`text-xs font-bold uppercase ${theme === 'dark' ? 'text-gray-400' : 'text-earth-500'}`}>{t('ledger.debt')}</span>
                 <span className={`font-bold ${customer.debt > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                   {formatCurrency(customer.debt || 0, lang)}
                 </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3">
                {customer.debt > 0 && (
                  <button 
                    onClick={() => { setSelectedCustomer(customer); setIsPayModalOpen(true); }}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900 hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Wallet size={14}/> {t('ledger.receivePayment')}
                  </button>
                )}
                
                <button 
                   onClick={() => { setEditingCustomer(customer); setIsEditModalOpen(true); }}
                   className="px-3 py-2 rounded-xl text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                >
                   <Edit3 size={12}/> Notes
                </button>

                {/* NEW: View History Button (Advanced Ledger) */}
                <button 
                   onClick={() => fetchCustomerHistory(customer)}
                   className="flex-1 py-2 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                >
                   <List size={12}/> History
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Customer Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('ledger.addCustomer')}>
        <form onSubmit={handleAdd} className="space-y-2">
          <Input label={t('ledger.name')} required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <Input label={t('ledger.phone')} type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          <Input label={t('ledger.address')} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
          <div className="h-6" />
          <Button icon={<Plus size={20}/>}>{t('common.save')}</Button>
        </form>
      </Modal>

      {/* Payment Modal */}
      <Modal isOpen={isPayModalOpen} onClose={() => setIsPayModalOpen(false)} title={t('ledger.receivePayment')}>
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

      {/* Edit Customer Notes Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Customer Notes">
        <form onSubmit={handleUpdateCustomer} className="space-y-2">
          <div className="mb-4">
             <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Customer</label>
             <input disabled value={editingCustomer?.name} className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded text-gray-500 dark:text-gray-400" />
          </div>
          <div className="mb-4">
             <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Notes</label>
             <textarea
                className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-cream-200'}`}
                rows={4}
                placeholder="Add address, preferences, or credit warnings..."
                value={editingCustomer?.notes || ''}
                onChange={(e) => setEditingCustomer({...editingCustomer, notes: e.target.value})}
             />
          </div>
          <Button icon={<Edit3 size={20}/>}>Save Notes</Button>
        </form>
      </Modal>

      {/* NEW: Customer Transaction History Modal */}
      <Modal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} title={`History: ${selectedCustomer?.name}`}>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {customerHistory.length === 0 ? (
               <p className="text-center text-gray-500">No transactions found.</p>
            ) : (
               customerHistory.map((sale) => (
                 <div key={sale.id} className="flex justify-between items-center border-b border-gray-100 pb-2 dark:border-gray-700 dark:text-white">
                    <div>
                       <p className="text-sm font-bold">{sale.quantity} items</p>
                       <p className="text-xs text-gray-500">{new Date(sale.date).toLocaleDateString()}</p>
                       {sale.dueDate && <p className="text-[10px] text-orange-500">Due: {new Date(sale.dueDate).toLocaleDateString()}</p>}
                    </div>
                    <div className="text-right">
                       <p className="font-bold text-lg">{formatCurrency(sale.total, lang)}</p>
                    </div>
                 </div>
               ))
            )}
        </div>
      </Modal>

    </div>
  );
};

export default Ledger;
