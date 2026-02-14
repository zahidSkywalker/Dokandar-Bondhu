import React, { useState } from 'react';
import { Plus, User, Phone, MapPin, DollarSign, Trash2, Edit } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import BottomSheet from '../ui/BottomSheet';
import Button from '../ui/Button';
import Card from '../ui/Card';
import AmountInput from '../ui/AmountInput';
import { formatCurrency, formatDate } from '../../lib/utils';

const Ledger: React.FC = () => {
  const { t, lang } = useLanguage();
  const { addCustomer, updateCustomer, updateCustomerDebt, recordPayment } = useApp();

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(0);

  const customers = useLiveQuery(() => db.customers.orderBy('name').toArray());

  const resetCustomerForm = () => { setName(''); setPhone(''); setAddress(''); setSelectedCustomer(null); };
  const resetPaymentForm = () => { setPaymentAmount(0); setSelectedCustomer(null); };

  const openCustomerModal = (customer?: any) => {
    if (customer) {
      setSelectedCustomer(customer);
      setName(customer.name);
      setPhone(customer.phone);
      setAddress(customer.address);
    } else {
      resetCustomerForm();
    }
    setIsCustomerModalOpen(true);
  };

  const openPaymentModal = (customer: any) => {
    setSelectedCustomer(customer);
    setPaymentAmount(0);
    setIsPaymentModalOpen(true);
  };

  const closeCustomerModal = () => { setIsCustomerModalOpen(false); resetCustomerForm(); };
  const closePaymentModal = () => { setIsPaymentModalOpen(false); resetPaymentForm(); };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return alert("Name is required");
    setIsProcessing(true);
    try {
      if (selectedCustomer) {
        await updateCustomer(selectedCustomer.id, { name, phone, address });
      } else {
        await addCustomer({ name, phone, address });
      }
      closeCustomerModal();
    } catch (e) { alert("Error saving customer"); } 
    finally { setIsProcessing(false); }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentAmount <= 0) return alert("Invalid amount");
    
    setIsProcessing(true);
    try {
      await recordPayment({
        customerId: selectedCustomer.id,
        amount: paymentAmount,
        date: new Date(),
        note: 'Payment received'
      });
      closePaymentModal();
    } catch (e) { alert("Error recording payment"); }
    finally { setIsProcessing(false); }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(t('common.confirmDelete'))) {
        await db.customers.delete(id);
    }
  };

  return (
    <div className="pb-32 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-h1 text-prussian font-display">{t('ledger.title')}</h1>
        <button onClick={() => openCustomerModal()} className="flex items-center gap-2 bg-orange text-white px-4 py-2 rounded-md shadow-float active:scale-95 transition-transform">
          <Plus size={18} /> <span className="font-semibold">{t('ledger.addCustomer')}</span>
        </button>
      </div>

      <div className="space-y-2">
        {!customers || customers.length === 0 ? (
          <div className="text-center py-20">
            <User size={40} className="mx-auto text-prussian/20 mb-2"/>
            <p className="text-secondary">{t('common.noData')}</p>
          </div>
        ) : (
          customers.map(customer => (
            <Card key={customer.id} className="flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-prussian text-lg">{customer.name}</h3>
                  {customer.phone && <p className="text-small text-secondary flex items-center gap-1"><Phone size={10}/>{customer.phone}</p>}
                </div>
                <div className="text-right">
                  <p className="text-xs text-secondary">Due</p>
                  <p className="text-lg font-bold text-red-500">{formatCurrency(customer.debt, lang)}</p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-2 border-t border-gray-100 pt-2 justify-end">
                <button onClick={() => openPaymentModal(customer)} className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1.5 rounded-md text-xs font-bold active:scale-95 transition-transform">
                  <DollarSign size={12}/> Pay
                </button>
                <button onClick={() => openCustomerModal(customer)} className="p-1.5 text-prussian/60 hover:bg-alabaster rounded-md active:scale-95 transition-transform"><Edit size={14}/></button>
                <button onClick={() => handleDelete(customer.id!)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-md active:scale-95 transition-transform"><Trash2 size={14}/></button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Customer Modal */}
      <BottomSheet isOpen={isCustomerModalOpen} onClose={closeCustomerModal} title={selectedCustomer ? t('common.edit') : t('ledger.addCustomer')}
        footer={<Button onClick={handleSaveCustomer} isLoading={isProcessing} icon={<Plus size={18} />}>{t('common.save')}</Button>}>
        <div className="space-y-5">
          <div>
            <label className="block text-small font-semibold mb-2 text-prussian">{t('ledger.name')}</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full h-[50px] bg-white border border-gray-border rounded-md px-4 focus:ring-2 focus:ring-orange focus:outline-none" />
          </div>
          <div>
            <label className="block text-small font-semibold mb-2 text-prussian">{t('ledger.phone')}</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full h-[50px] bg-white border border-gray-border rounded-md px-4 focus:ring-2 focus:ring-orange focus:outline-none" />
          </div>
          <div>
            <label className="block text-small font-semibold mb-2 text-prussian">{t('ledger.address')}</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full h-[50px] bg-white border border-gray-border rounded-md px-4 focus:ring-2 focus:ring-orange focus:outline-none" />
          </div>
        </div>
      </BottomSheet>

      {/* Receive Payment Modal */}
      <BottomSheet isOpen={isPaymentModalOpen} onClose={closePaymentModal} title={t('ledger.receivePayment')}
        footer={<Button onClick={handlePayment} isLoading={isProcessing} variant="success" icon={<DollarSign size={18} />}>Collect Payment</Button>}>
        <div className="space-y-5">
          <div className="bg-alabaster p-4 rounded-md text-center">
            <p className="text-small text-secondary mb-1">Customer</p>
            <p className="text-h2 font-bold text-prussian">{selectedCustomer?.name}</p>
            <p className="text-sm text-red-500 mt-1">Current Due: {formatCurrency(selectedCustomer?.debt || 0, lang)}</p>
          </div>

          <AmountInput value={paymentAmount} onChange={setPaymentAmount} label="Payment Amount" />
        </div>
      </BottomSheet>
    </div>
  );
};

export default Ledger;
