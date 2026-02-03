import React, { useState, useEffect } from 'react';
import { Plus, User, Phone, MapPin, CheckCircle, Wallet, AlertTriangle, RefreshCw } from 'lucide-react';
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
  // UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState('');  
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  // Data States
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  // Safe Data Fetching
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      setDbError(null);
      
      try {
        // Explicit check for table existence
        if (!db.customers) {
          throw new Error("Database table 'customers' not found. Try clearing site data.");
        }

        const allCustomers = await db.customers.orderBy('debt').reverse().toArray();
        
        if (isMounted) {
          setCustomers(allCustomers);
          setLoading(false);
        }
      } catch (err: any) {
        console.error("LEDGER DB ERROR:", err);
        if (isMounted) {
          setCustomers([]); // Fallback
          setLoading(false);
          setDbError(err.message || "Database Error");
        }
      }
    };

    loadData();

    return () => { isMounted = false; };
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCustomer(formData);
      setIsModalOpen(false);
      setFormData({ name: '', phone: '', address: '' });
      
      // Force refresh manually to be safe
      if (db.customers) {
        const updated = await db.customers.toArray();
        setCustomers(updated);
      }
    } catch (err: any) { 
      alert("Error adding customer: " + err.message); 
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
      
      // Force refresh manually
      if (db.customers) {
         const updated = await db.customers.toArray();
         setCustomers(updated);
      }
    } catch (err: any) { 
      alert("Error processing payment: " + err.message); 
    }
  };

  return (
    <div className={`pb-24 max-w-2xl mx-auto ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-cream-50 text-earth-900'}`}>
      
      <div className="flex justify-between items-center mb-6 mt-2">
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>Baki Khata</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className={`p-3 rounded-2xl shadow-xl active:scale-95 transition-transform ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-earth-800 text-white'}`}
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Error Display */}
      {dbError && (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-xl flex flex-col items-center justify-center text-center mb-6">
          <AlertTriangle className="text-red-500 mb-2" size={48} />
          <p className="text-red-600 dark:text-red-400 font-bold text-lg">Database Error</p>
          <p className="text-red-500 dark:text-red-500 text-sm max-w-md">{dbError}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg font-bold flex items-center justify-center gap-2">
            <RefreshCw size={16}/> Refresh Page
          </button>
        </div>
      )}

      <div className="space-y-4">
        {loading && !dbError ? (
          <div className="flex justify-center items-center p-10">
             <div className="w-8 h-8 border-4 border-earth-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : customers.length === 0 ? (
          <p className={`text-center mt-10 ${theme === 'dark' ? 'text-gray-400' : 'text-earth-400'}`}>No customers yet. Add one to start.</p>
        ) : (
          customers.map((customer) => (
            <div key={customer.id} className={`p-5 rounded-2xl border shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}>
              
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
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-lg font-bold text-sm ${customer.debt > 0 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>
                  {customer.debt > 0 ? 'Due' : 'Cleared'}
                </div>
              </div>
              
              {/* Total Debt Section */}
              <div className={`flex justify-between items-center p-3 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-earth-50'}`}>
                 <span className={`text-xs font-bold uppercase ${theme === 'dark' ? 'text-gray-400' : 'text-earth-500'}`}>Total Debt</span>
                 <span className={`font-bold ${customer.debt > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                   {formatCurrency(customer.debt || 0, lang)}
                 </span>
              </div>

              {/* Action Button */}
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
            {/* FIX: Added safe default to 0 to prevent undefined error */}
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
