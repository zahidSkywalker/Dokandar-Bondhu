import React, { useState } from 'react';
import { Plus, User, Phone, MapPin, CheckCircle, Wallet } from 'lucide-react';
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
  const { addCustomer, updateCustomerDebt } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState('');  
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });

  const customers = useLiveQuery(() => db.customers.orderBy('debt').reverse().toArray(), []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCustomer(formData);
      setIsModalOpen(false);
      setFormData({ name: '', phone: '', address: '' });
    } catch (err) { alert("Error adding customer"); }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    try {
      await updateCustomerDebt(selectedCustomer.id, -parseFloat(paymentAmount));
      setIsPayModalOpen(false);
      setPaymentAmount('');
      setSelectedCustomer(null);
    } catch (err) { alert("Error processing payment"); }
  };

  return (
    <div className={`pb-24 max-w-2xl mx-auto min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-cream-50 text-earth-900'}`}>
      
      <div className="flex justify-between items-center mb-6 mt-2">
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>Baki Khata</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className={`p-3 rounded-2xl shadow-xl active:scale-95 transition-transform ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-earth-800 text-white'}`}
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-4">
        {!customers ? <p className="text-center p-4">Loading...</p> : customers.length === 0 ? (
          <p className={`text-center mt-10 ${theme === 'dark' ? 'text-gray-400' : 'text-earth-400'}`}>No customers yet</p>
        ) : (
          customers.map((customer) => (
            <div key={customer.id} className={`p-5 rounded-2xl border shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
              
              {/* Top Section: Info & Badge */}
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
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-lg font-bold text-sm ${customer.debt > 0 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>
                  {customer.debt > 0 ? 'Due' : 'Cleared'}
                </div>
              </div>
              
              {/* Middle Section: Total Debt */}
              <div className={`flex justify-between items-center p-3 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-earth-50'}`}>
                 <span className={`text-xs font-bold uppercase ${theme === 'dark' ? 'text-gray-400' : 'text-earth-500'}`}>Total Debt</span>
                 <span className={`font-bold ${customer.debt > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                   {formatCurrency(customer.debt, lang)}
                 </span>
              </div>

              {/* Bottom Section: Action Button */}
              {customer.debt > 0 && (
                <button 
                  onClick={() => { setSelectedCustomer(customer); setIsPayModalOpen(true); }}
                  className="w-full mt-3 py-2 rounded-xl text-xs font-bold bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900 hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Wallet size={14}/> Receive Payment
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Customer Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Customer">
        <form onSubmit={handleAdd} className="space-y-2">
          <Input label="Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <Input label="Phone" type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          <Input label="Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
          <div className="h-6" />
          <Button icon={<Plus size={20}/>}>Save</Button>
        </form>
      </Modal>

      {/* Payment Modal */}
      <Modal isOpen={isPayModalOpen} onClose={() => setIsPayModalOpen(false)} title="Receive Payment">
        <form onSubmit={handlePayment} className="space-y-2">
          <div className={`p-4 rounded-xl mb-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-cream-100'}`}>
            <p className="text-xs uppercase font-bold text-earth-500 dark:text-gray-400 mb-1">Current Debt</p>
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>{formatCurrency(selectedCustomer?.debt, lang)}</p>
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
