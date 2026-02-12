import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Check, ShoppingCart, User, Users, AlertTriangle, Calendar } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import FlowAnimation from '../ui/FlowAnimation';
import { formatCurrency, formatDate, toEnglishDigits } from '../../lib/utils';

const Sales: React.FC = () => {
  const { t, lang } = useLanguage();
  const { theme } = useTheme();
  const { addSale } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productId, setProductId] = useState<string>('');
  const [customerId, setCustomerId] = useState<string>('');
  const [staffId, setStaffId] = useState<string>('');
  const [quantity, setQuantity] = useState('');
  const [dueDate, setDueDate] = useState<string>('');
  const [marginAlert, setMarginAlert] = useState<string | null>(null);
  const [showFlowAnimation, setShowFlowAnimation] = useState(false);

  const products = useLiveQuery(() => db.products.toArray());
  const customers = useLiveQuery(() => db.customers.toArray());
  const staff = useLiveQuery(() => db.staff.toArray());
  const recentSales = useLiveQuery(() => db.sales.orderBy('date').reverse().limit(10).toArray(), []);

  const selectedProduct = useMemo(() => products?.find(p => p.id === Number(productId)), [productId, products]);
  const selectedCustomer = useMemo(() => customers?.find(c => c.id === Number(customerId)), [customerId, customers]);

  useEffect(() => {
    if (selectedProduct && quantity) {
      const margin = selectedProduct.sellPrice - selectedProduct.buyPrice;
      if (margin < 0) setMarginAlert("Selling at a loss!");
      else if ((margin/selectedProduct.buyPrice) < 0.1) setMarginAlert("Low margin");
      else setMarginAlert(null);
    } else setMarginAlert(null);
  }, [selectedProduct, quantity]);

  const handleSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      setShowFlowAnimation(true);
      await addSale({
        productId: selectedProduct.id!,
        productName: selectedProduct.name,
        quantity: parseInt(toEnglishDigits(quantity)),
        buyPrice: selectedProduct.buyPrice,
        sellPrice: selectedProduct.sellPrice,
        date: new Date(),
        customerId: customerId ? Number(customerId) : undefined,
        staffId: staffId ? Number(staffId) : undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      });
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) { 
      alert(err.message || "Error"); 
      setShowFlowAnimation(false);
    }
  };
  
  const resetForm = () => {
    setProductId(''); setCustomerId(''); setStaffId(''); setQuantity(''); setDueDate(''); setMarginAlert(null);
  };

  return (
    <div className="pb-24 max-w-2xl mx-auto">
      <FlowAnimation trigger={showFlowAnimation} color="#10B981" />

      <div className="flex justify-between items-center mb-6 mt-2">
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>{t('sales.title')}</h1>
        <button onClick={() => setIsModalOpen(true)} className={`p-3 rounded-2xl shadow-xl active:scale-95 transition-transform bg-primary text-white`}><Plus size={24} /></button>
      </div>

      <div className="space-y-4">
        {!recentSales ? <SalesSkeleton /> : recentSales.map((sale) => (
          <div key={sale.id} className={`p-4 rounded-2xl border shadow-sm flex justify-between items-center ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
            <div className="flex items-center gap-4">
               <div className={`p-2 rounded-xl bg-primary/10 text-primary`}><ShoppingCart size={20} /></div>
               <div>
                <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>{sale.productName}</h3>
                <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-earth-500'}`}>
                  {formatDate(sale.date, lang)} • {sale.quantity} pcs
                </div>
                {sale.customerId && <span className="text-[10px] text-blue-500 flex items-center gap-1"><User size={10}/> Due Customer</span>}
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-earth-800'}`}>{formatCurrency(sale.total, lang)}</p>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={t('sales.newSale')}>
        <form onSubmit={handleSale} className="space-y-2">
          <select className={`w-full mb-2 px-4 py-3 rounded-xl ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-cream-200 text-earth-800'}`} value={productId} onChange={(e) => setProductId(e.target.value)} required>
            <option value="">Select Product</option>
            {products?.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>)}
          </select>
          <select className={`w-full mb-2 px-4 py-3 rounded-xl ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-cream-200 text-earth-800'}`} value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
            <option value="">Cash Payment</option>
            {customers?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          
          {marginAlert && (
             <div className={`p-3 rounded-lg mb-4 flex items-center gap-2 text-xs font-bold bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400`}>
                <AlertTriangle size={14} /> {marginAlert}
             </div>
          )}

          <Input label={t('sales.quantity')} type="number" min="1" required value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          {selectedProduct && quantity && (
             <div className={`mb-4 p-4 rounded-xl flex justify-between items-center shadow-lg bg-primary text-white`}>
                <span className="font-medium">Total</span>
                <span className="text-2xl font-bold">{formatCurrency(selectedProduct.sellPrice * parseInt(toEnglishDigits(quantity)), lang)}</span>
             </div>
          )}
          <Button type="submit" icon={<Check size={20} />}>Confirm Sale</Button>
        </form>
      </Modal>
    </div>
  );
};

const SalesSkeleton = () => (
  <div className="space-y-4">
    {[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
  </div>
);

export default Sales;
