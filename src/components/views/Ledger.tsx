import React, { useState } from 'react';
import { Plus, User, Phone, MapPin, Wallet, Edit3, Trash2, List, CheckCircle, ArrowDownRight, TrendingUp } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { formatCurrency, formatDate } from '../../lib/utils';

const Ledger: React.FC = () => {
  const { t, lang } = useLanguage();
  const { addCustomer, updateCustomer, recordPayment } = useApp();  
  
  // UI States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [statementData, setStatementData] = useState<any[]>([]);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', notes: '' });

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
        name: formData.name, phone: formData.phone, address: formData.address, notes: formData.notes 
      });
      setIsManageModalOpen(false);
      setFormData({ name: '', phone: '', address: '', notes: '' });
    } catch (err: any) { alert("Error updating customer"); }
  };

  const handleDeleteDebtor = async () => {
    if (confirm("Delete this customer?")) {
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
      await recordPayment({
        customerId: selectedCustomer.id,
        amount: amount,
        date: new Date(),
        note: paymentNote
      });
      setIsPaymentModalOpen(false);
      setPaymentAmount('');
      setPaymentNote('');
      setSelectedCustomer(null);
    } catch (err: any) { alert("Error processing payment"); }
  };

  const openManageModal = (customer: any) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name, phone: customer.phone || '', address: customer.address || '', notes: customer.notes || ''
    });
    setIsManageModalOpen(true);
  };

  const openPaymentModal = (customer: any) => {
    setSelectedCustomer(customer);
    setIsPaymentModalOpen(true);
  };

  const openStatement = async (customer: any) => {
    setSelectedCustomer(customer);
    
    // 1. Get Sales (Credits)
    const sales = await db.sales.where('customerId').equals(customer.id).toArray();
    // 2. Get Payments (Debits)
    const payments = await db.payments.where('customerId').equals(customer.id).toArray();

    // 3. Merge and Sort
    const transactions = [
      ...sales.map(s => ({
        id: s.id, date: new Date(s.date).getTime(), type: 'Sale',
        desc: `Sale: ${s.quantity} items`, amount: s.total, balance: 0
      })),
      ...payments.map(p => ({
        id: p.id, date: new Date(p.date).getTime(), type: 'Payment',
        desc: `Payment: ${p.note || 'Repayment'}`, amount: -p.amount, balance: 0
      }))
    ].sort((a, b) => a.date - b.date);

    // 4. Calculate Running Balance
    let runningBalance = 0;
    const statementWithBalance = transactions.map(tx => {
      runningBalance += tx.amount;
      return { ...tx, balance: runningBalance, dateObj: new Date(tx.date) };
    });

    setStatementData(statementWithBalance);
    setIsStatementModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-prussian font-display">{t('ledger.title')}</h1>
        <button onClick={() => setIsAddModalOpen(true)} className="bg-orange text-prussian p-3 rounded-2xl shadow-xl active:scale-95 transition-transform">
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-4">
        {!customers ? <div className="text-center p-8">Loading...</div> : customers.length === 0 ? (
          <div className="p-16 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white">
            <User className="mx-auto text-prussian/20 mb-4" size={64} />
            <p className="text-prussian/50 font-medium">No customers yet.</p>
          </div>
        ) : (
          customers.map((customer, i) => (
            <div key={customer.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm stagger-item" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-alabaster text-prussian"><User size={20} /></div>
                  <div>
                    <h3 className="font-bold text-prussian text-lg">{customer.name}</h3>
                    {customer.phone && <p className="text-xs text-prussian/50 flex items-center gap-1"><Phone size={10}/> {customer.phone}</p>}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${customer.debt > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                  {customer.debt > 0 ? 'Due' : 'Cleared'}
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-alabaster rounded-xl mb-3">
                <span className="text-xs font-bold text-prussian/60 uppercase">Total Debt</span>
                <span className={`text-xl font-bold ${customer.debt > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(customer.debt || 0, lang)}
                </span>
              </div>

              <div className="flex gap-2">
                <button onClick={() => openManageModal(customer)} className="flex-1 py-2 rounded-xl text-xs font-bold bg-alabaster text-prussian/70 hover:bg-gray-200 transition-colors">
                  <Edit3 size={14} className="inline mr-1"/> Manage
                </button>
                {customer.debt > 0 && (
                  <button onClick={() => openPaymentModal(customer)} className="flex-1 py-2 rounded-xl text-xs font-bold bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
                    <Wallet size={14} className="inline mr-1"/> Pay Due
                  </button>
                )}
                <button onClick={() => openStatement(customer)} className="flex-1 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                  <List size={14} className="inline mr-1"/> History
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={t('ledger.addCustomer')}>
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label={t('ledger.name')} required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <Input label={t('ledger.phone')} type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          <Input label={t('ledger.address')} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
          <Input label="Notes" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
          <Button icon={<Plus size={20}/>}>Save Customer</Button>
        </form>
      </Modal>

      <Modal isOpen={isManageModalOpen} onClose={() => setIsManageModalOpen(false)} title="Manage Debtor">
        <form onSubmit={handleUpdateDebtor} className="space-y-4">
          <Input label="Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <Input label="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          <Input label="Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Button icon={<Edit3 size={20} />}>Update</Button>
            <button type="button" onClick={handleDeleteDebtor} className="bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-colors">
              <Trash2 size={18} className="inline mr-2" /> Delete
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} title="Record Payment">
        <form onSubmit={handlePayment} className="space-y-4">
          <div className="p-6 rounded-2xl mb-4 bg-alabaster flex justify-between items-end">
            <div>
              <p className="text-xs font-bold text-prussian/60 mb-1">{t('ledger.debt')}</p>
              <p className="text-3xl font-bold text-prussian">{formatCurrency(selectedCustomer?.debt || 0, lang)}</p>
            </div>
          </div>
          <Input label="Payment Amount" type="number" required value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
          <Input label="Note" value={paymentNote} onChange={(e) => setPaymentNote(e.target.value)} />
          <Button variant="success" icon={<CheckCircle size={20}/>}>Confirm Payment</Button>
        </form>
      </Modal>

      {/* Statement Modal */}
      <Modal isOpen={isStatementModalOpen} onClose={() => setIsStatementModalOpen(false)} title={`Statement: ${selectedCustomer?.name}`}>
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-alabaster flex justify-between items-end mb-4">
            <p className="text-xs font-bold text-prussian/60">Current Balance</p>
            <p className={`text-2xl font-bold ${selectedCustomer?.debt > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {formatCurrency(statementData.length > 0 ? statementData[statementData.length - 1]?.balance : 0, lang)}
            </p>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {statementData.length === 0 ? (
              <p className="text-center py-8 text-prussian/50">No transactions found.</p>
            ) : (
              statementData.map((tx, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-gray-100 stagger-item" style={{ animationDelay: `${i * 30}ms` }}>
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded ${tx.type === 'Sale' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {tx.type === 'Sale' ? <TrendingUp size={14} /> : <ArrowDownRight size={14} />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-prussian">{tx.desc}</p>
                      <p className="text-[10px] text-prussian/50">{formatDate(tx.dateObj, lang)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount, lang)}
                    </p>
                    <p className="text-[10px] text-prussian/50">Bal: {formatCurrency(tx.balance, lang)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Ledger;
