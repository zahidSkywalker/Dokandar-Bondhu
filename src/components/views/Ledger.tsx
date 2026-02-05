import React from 'react';
import { Plus, User, Phone, MapPin, CheckCircle, Wallet, Edit3 } from 'lucide-react';
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
  
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState<any>(null);
  const [editingCustomer, setEditingCustomer] = React.useState<any>(null);
  const [paymentAmount, setPaymentAmount] = React.useState('');  
  const [formData, setFormData] = React.useState({ name: '', phone: '', address: '' });
  
  const customers = useLiveQuery(() => db.customers.orderBy('debt').reverse().toArray(), []);

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
    <div className={`pb-24 max-w-2xl mx-auto ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      <div className="flex justify-between items-center mb-6 mt-2">
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('ledger.title')}</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className={`p-3 rounded-2xl shadow-lg shadow-primary-500/10 active:scale-95 transition-transform ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-primary-600 text-white'}`}
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-3">
        {!customers ? <div className="p-4 text-center">Loading...</div> : customers.length === 0 ? (
          <p className={`text-center mt-10 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>No customers yet. Add one to start.</p>
        ) : (
          customers.map((customer) => (
            <div key={customer.id} className={`
              p-5 rounded-xl border shadow-sm
              ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}
            `}>
              
              {/* Info Section */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className={`font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{customer.name}</h3>
                    {customer.phone && (
                      <p className={`text-xs flex items-center gap-1 mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        <Phone size={12}/> {customer.phone}
                      </p>
                    )}
                    {customer.address && (
                      <p className={`text-xs flex items-center gap-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        <MapPin size={12}/> {customer.address}
                      </p>
                    )}
                    {customer.notes && (
                       <p className={`text-xs mt-2 italic text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded max-w-[200px]`}>
                         "{customer.notes}"
                       </p>
                    )}
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-lg font-bold text-xs border ${
                  customer.debt > 0 
                    ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30' 
                    : 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30'
                }`}>
                  {customer.debt > 0 ? 'Due' : 'Cleared'}
                </div>
              </div>
              
              {/* Total Debt */}
              <div className={`flex justify-between items-center p-3 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                 <span className={`text-xs font-bold uppercase tracking-wide ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{t('ledger.debt')}</span>
                 <span className={`font-bold text-lg font-mono ${customer.debt > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                   {formatCurrency(customer.debt || 0, lang)}
                 </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3">
                {customer.debt > 0 && (
                  <button 
                    onClick={() => { setSelectedCustomer(customer); setIsPayModalOpen(true); }}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Wallet size={14}/> {t('ledger.receivePayment')}
                  </button>
                )}
                <button 
                   onClick={() => { setEditingCustomer(customer); setIsEditModalOpen(true); }}
                   className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1"
                >
                   <Edit3 size={12}/> Notes
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
          <div className={`p-4 rounded-xl mb-4 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <p className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">{t('ledger.debt')}</p>
            <p className={`text-2xl font-bold font-mono ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
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
             <label className="block text-sm font-bold mb-1 text-slate-700 dark:text-slate-300">Customer</label>
             <input disabled value={editingCustomer?.name} className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 border-none" />
          </div>
          <div className="mb-4">
             <label className="block text-sm font-bold mb-1 text-slate-700 dark:text-slate-300">Notes</label>
             <textarea
                className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                rows={4}
                placeholder="Add address, preferences, or credit warnings..."
                value={editingCustomer?.notes || ''}
                onChange={(e) => setEditingCustomer({...editingCustomer, notes: e.target.value})}
             />
          </div>
          <Button icon={<Edit3 size={20}/>}>Save Notes</Button>
        </form>
      </Modal>

    </div>
  );
};

export default Ledger;
