import React, { useState } from 'react';
import { Plus, User, Phone, MapPin, Wallet, Edit3, Trash2, List } from 'lucide-react';
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', notes: '' });
  const [paymentAmount, setPaymentAmount] = useState('');

  const customers = useLiveQuery(() => db.customers.orderBy('debt').reverse().toArray());  

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCustomer(formData);
    setIsAddModalOpen(false);
    setFormData({ name: '', phone: '', address: '', notes: '' });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!selectedCustomer) return;
    await recordPayment({ customerId: selectedCustomer.id, amount: parseFloat(paymentAmount), date: new Date() });
    setIsPaymentModalOpen(false);
    setPaymentAmount('');
    setSelectedCustomer(null);
  };

  const openManageModal = (customer: any) => {
    setSelectedCustomer(customer);
    setFormData({ name: customer.name, phone: customer.phone || '', address: customer.address || '', notes: customer.notes || '' });
    setIsManageModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-prussian font-display">{t('ledger.title')}</h1>
        <button onClick={() => setIsAddModalOpen(true)} className="bg-orange text-prussian p-3 rounded-2xl shadow-xl active:scale-95 transition-transform">
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-3">
        {!customers ? <div className="text-center p-8">Loading...</div> : customers.length === 0 ? (
          <div className="p-16 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white">
            <User className="mx-auto text-prussian/20 mb-4" size={64} />
            <p className="text-prussian/50 font-medium">No customers yet.</p>
          </div>
        ) : (
          customers.map((customer, i) => (
            <div 
                key={customer.id} 
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm stagger-item"
                style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-alabaster text-prussian">
                        <User size={20} />
                    </div>
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
                  <button onClick={() => { setSelectedCustomer(customer); setIsPaymentModalOpen(true); }} className="flex-1 py-2 rounded-xl text-xs font-bold bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
                     <Wallet size={14} className="inline mr-1"/> Pay Due
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Customer Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={t('ledger.addCustomer')}>
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label={t('ledger.name')} required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <Input label={t('ledger.phone')} type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          <Input label={t('ledger.address')} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
          <Button icon={<Plus size={20}/>}>Save Customer</Button>
        </form>
      </Modal>

      {/* Manage Modal */}
      <Modal isOpen={isManageModalOpen} onClose={() => setIsManageModalOpen(false)} title="Manage Debtor">
         <div className="space-y-4">
            <p className="text-sm text-prussian/70">Editing: <span className="font-bold text-prussian">{selectedCustomer?.name}</span></p>
            <Button variant="ghost" onClick={() => { if(confirm("Delete?")) { db.customers.delete(selectedCustomer.id); setIsManageModalOpen(false); }}}>
                <Trash2 size={16} className="text-red-500 mr-2"/> Delete Customer
            </Button>
         </div>
      </Modal>

      {/* Payment Modal */}
      <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} title="Record Payment">
        <form onSubmit={handlePayment} className="space-y-4">
          <div className="p-4 rounded-xl bg-alabaster text-center mb-4">
            <p className="text-xs text-prussian/60 uppercase font-bold">Current Debt</p>
            <p className="text-3xl font-bold text-prussian">{formatCurrency(selectedCustomer?.debt || 0, lang)}</p>
          </div>
          <Input label="Payment Amount" type="number" required value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
          <Button variant="primary" icon={<Wallet size={16}/>}>Confirm Payment</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Ledger;
