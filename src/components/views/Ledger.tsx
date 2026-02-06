import React, { useState } from 'react';
import { Plus, User, Phone, MapPin, Wallet, Edit3, Trash2, List, CheckCircle, CreditCard, ChevronDown, TrendingUp, ArrowDownRight, RefreshCw } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { formatCurrency, formatDate } from '../../lib/utils';

const Ledger: React.FC = () => {
  const { t, lang } = useLanguage();
  const { theme } = useTheme();
  const { addCustomer, updateCustomer, recordPayment } = useApp(); // Using recordPayment
  
  // UI States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [statementData, setStatementData] = useState<any[]>([]);
  
  // Form States
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', notes: '' });
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNote, setPaymentNote] = useState('');

  const customers = useLiveQuery(() => db.customers.orderBy('debt').reverse().toArray());
  
  // --- Handlers ---

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCustomer(formData);
      setIsAddModalOpen(false);
      setFormData({ name: '', phone: '', address: '', notes: '' });
    } catch (err: any) { alert("Error adding customer"); }
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
    } catch (err: any) { alert("Error updating customer"); }
  };

  const handleDeleteDebtor = async () => {
    if (confirm("Are you sure you want to delete this debtor? This action cannot be undone.")) {
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
      // Use the new recordPayment function
      await recordPayment({
        customerId: selectedCustomer.id,
        amount: parseFloat(paymentAmount),
        date: new Date(),
        note: paymentNote
      });
      setIsPaymentModalOpen(false);
      setPaymentAmount('');
      setPaymentNote('');
      setSelectedCustomer(null);
    } catch (err: any) { 
      alert(err.message || "Error processing payment");
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

  // NEW: Professional Statement Logic
  const openStatement = async (customer: any) => {
    setSelectedCustomer(customer);
    
    // 1. Get Sales (Credits - Increases Debt)
    const sales = await db.sales.where('customerId').equals(customer.id).toArray();
    
    // 2. Get Payments (Debits - Decreases Debt)
    const payments = await db.payments.where('customerId').equals(customer.id).toArray();

    // 3. Merge and Sort by Date
    const transactions = [
      ...sales.map(s => ({
        id: s.id,
        date: new Date(s.date).getTime(),
        type: 'Sale',
        desc: `Sale: ${s.quantity} items`,
        amount: s.total, // Positive because it increases the debt balance
        balance: 0 // Placeholder
      })),
      ...payments.map(p => ({
        id: p.id,
        date: new Date(p.date).getTime(),
        type: 'Payment',
        desc: `Payment: ${p.note || 'Repayment'}`,
        amount: -p.amount, // Negative because it reduces the debt balance
        balance: 0
      }))
    ].sort((a, b) => a.date - b.date);

    // 4. Calculate Running Balance (Oldest to Newest)
    let runningBalance = 0;
    const statementWithBalance = transactions.map(tx => {
      runningBalance += tx.amount;
      return { ...tx, balance: runningBalance, dateObj: new Date(tx.date) };
    });

    setStatementData(statementWithBalance);
    setIsStatementModalOpen(true);
  };

  return (
    <div className={`pb-32 max-w-3xl mx-auto min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-[#F9FAFB] text-gray-800'}`}>
      
      {/* Header - More Spacing */}
      <div className="flex justify-between items-center mb-8 mt-6">
        <div>
          <h1 className={`text-3xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('ledger.title')}</h1>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Manage debts, credits, and repayments.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className={`bg-earth-800 text-white p-4 rounded-2xl shadow-lg shadow-earth-900/20 active:scale-95 transition-transform hover:bg-earth-700`}
        >
          <Plus size={28} />
        </button>
      </div>

      {/* Customer List - Increased Spacing and Card Radius */}
      <div className="space-y-6">
        {!customers ? <div className="p-8 text-center">Loading...</div> : customers.length === 0 ? (
          <div className="p-16 text-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl">
             <User className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
             <p className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No customers yet.</p>
          </div>
        ) : (
          customers.map((customer) => (
            <div key={customer.id} className={`p-8 rounded-3xl border shadow-sm transition-all hover:shadow-md ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              
              {/* Info Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-earth-800/20 text-earth-500' : 'bg-earth-50 text-earth-600'}`}>
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{customer.name}</h3>
                    {customer.phone && (
                      <p className={`text-sm flex items-center gap-2 mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Phone size={14}/> {customer.phone}
                      </p>
                    )}
                    {customer.address && (
                      <p className={`text-sm flex items-center gap-2 mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        <MapPin size={14}/> {customer.address}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Total Due Badge - Larger */}
                <div className={`px-5 py-2 rounded-xl font-bold text-base ${customer.debt > 0 ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'}`}>
                  {customer.debt > 0 ? 'Due' : 'Cleared'}
                </div>
              </div>
              
              {/* Stats Row - Cleaner Look */}
              <div className={`flex justify-between items-center p-5 rounded-2xl mb-6 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                 <span className={`text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{t('ledger.debt')}</span>
                 <span className={`text-3xl font-bold ${customer.debt > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                   {formatCurrency(customer.debt || 0, lang)}
                 </span>
              </div>

              {/* Action Buttons - More Spacious */}
              <div className="flex gap-4">
                
                <button 
                   onClick={() => openManageModal(customer)}
                   className="flex-1 py-4 rounded-2xl text-sm font-bold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                   <Edit3 size={16}/> Manage
                </button>

                {customer.debt > 0 && (
                  <button 
                    onClick={() => openPaymentModal(customer)}
                    className="flex-1 py-4 rounded-2xl text-sm font-bold bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900 hover:bg-green-100 transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Wallet size={16}/> Pay Due
                  </button>
                )}

                <button 
                   onClick={() => openStatement(customer)} 
                   className="flex-1 py-4 rounded-2xl text-sm font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                   <List size={16}/> Statement
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 1. Add Customer Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={t('ledger.addCustomer')}>
        <form onSubmit={handleAdd} className="space-y-3">
          <Input label={t('ledger.name')} required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <Input label={t('ledger.phone')} type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          <Input label={t('ledger.address')} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
          <Input label="Notes (Optional)" placeholder="Address, references, or credit warnings..." value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
          <div className="h-6" />
          <Button icon={<Plus size={20}/>}>Save Customer</Button>
        </form>
      </Modal>

      {/* 2. Manage Debtor Modal */}
      <Modal isOpen={isManageModalOpen} onClose={() => setIsManageModalOpen(false)} title="Manage Debtor">
        <form onSubmit={handleUpdateDebtor} className="space-y-3">
           <div className="mb-4">
             <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Customer</label>
             <input disabled value={selectedCustomer?.name} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-500 dark:text-gray-400" />
           </div>
          <Input label="Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <Input label={t('ledger.phone')} type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          <Input label={t('ledger.address')} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
          <Input label="Notes" placeholder="Address, references, or credit warnings..." value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
          <div className="h-6" />
          <div className="grid grid-cols-2 gap-4">
             <Button icon={<Edit3 size={20} />}>Update Info</Button>
             <button 
                type="button"
                onClick={handleDeleteDebtor}
                className="bg-red-500 text-white hover:bg-red-600 transition-colors rounded-xl px-4 py-3 font-bold text-sm"
             >
                <Trash2 size={18} className="inline mr-2" /> Remove
             </button>
          </div>
        </form>
      </Modal>

      {/* 3. Payment Modal */}
      <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} title="Record Payment">
        <form onSubmit={handlePayment} className="space-y-3">
          <div className={`p-6 rounded-2xl mb-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 mb-2">{t('ledger.debt')}</p>
            <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {formatCurrency(selectedCustomer?.debt || 0, lang)}
            </p>
          </div>
          <Input label="Payment Amount" type="number" required value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)}} />
          <Input label="Note (Optional)" placeholder="e.g. Monthly installment, partial payment..." value={paymentNote} onChange={(e) => setPaymentNote(e.target.value)} />
          <div className="h-6" />
          <Button variant="success" icon={<CheckCircle size={20}/>}>Confirm Payment</Button>
        </form>
      </Modal>

      {/* 4. Professional Statement Modal */}
      <Modal isOpen={isStatementModalOpen} onClose={() => setIsStatementModalOpen(false)} title={`Statement: ${selectedCustomer?.name}`}>
        <div className="space-y-4">
           {/* Header Summary */}
           <div className={`p-6 rounded-2xl border flex justify-between items-end ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
             <div>
                <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Total Balance</p>
                <p className={`text-3xl font-bold ${selectedCustomer?.debt > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {formatCurrency(selectedCustomer?.debt || 0, lang)}
                </p>
             </div>
             {selectedCustomer?.debt > 0 && (
                <button onClick={() => { setIsStatementModalOpen(false); openPaymentModal(selectedCustomer); }} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-2 rounded-lg font-bold">
                   Pay Now
                </button>
             )}
           </div>

           {/* Statement Table */}
           <div className={`rounded-2xl border overflow-hidden ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <div className={`grid grid-cols-4 gap-2 p-3 text-xs font-bold uppercase tracking-wider border-b ${theme === 'dark' ? 'text-gray-400 border-gray-700' : 'text-gray-500 border-gray-100'}`}>
                 <div>Date</div>
                 <div>Description</div>
                 <div className="text-right">Amount</div>
                 <div className="text-right">Balance</div>
              </div>
              
              <div className="max-h-[60vh] overflow-y-auto">
                 {statementData.map((tx, index) => (
                    <div key={index} className={`grid grid-cols-4 gap-2 p-4 border-b last:border-0 text-sm ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'} items-center`}>
                      <div className="text-gray-500 dark:text-gray-400 text-xs">{formatDate(tx.dateObj, lang)}</div>
                      
                      <div className="flex items-center gap-2">
                         <div className={`p-1.5 rounded-md ${tx.type === 'Sale' ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'}`}>
                           {tx.type === 'Sale' ? <TrendingUp size={12}/> : <Wallet size={12}/>}
                         </div>
                         <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{tx.desc}</span>
                      </div>
                      
                      <div className="text-right">
                         <span className={`font-bold ${tx.amount >= 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                           {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount, lang)}
                         </span>
                      </div>

                      <div className="text-right font-medium">
                        <span className={tx.balance > 0 ? 'text-red-500' : 'text-green-500'}>
                           {formatCurrency(tx.balance, lang)}
                        </span>
                      </div>
                    </div>
                 ))}
                 
                 {statementData.length === 0 && (
                    <p className="text-center py-8 text-gray-400">No transactions found.</p>
                 )}
              </div>
           </div>
        </div>
      </Modal>

    </div>
  );
};

export default Ledger;
