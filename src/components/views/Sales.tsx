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

  const products = useLiveQuery(() => db.products.toArray());
  const customers = useLiveQuery(() => db.customers.toArray());
  const staff = useLiveQuery(() => db.staff.toArray());
  const recentSales = useLiveQuery(
    () => db.sales.orderBy('date').reverse().limit(10).toArray(),
    []
  );

  const selectedProduct = useMemo(() => products?.find(p => p.id === Number(productId)), [productId, products]);
  const selectedCustomer = useMemo(() => customers?.find(c => c.id === Number(customerId)), [customerId, customers]);

  useEffect(() => {
    if (selectedProduct && quantity) {
      const buy = selectedProduct.buyPrice;
      const sell = selectedProduct.sellPrice;
      const margin = sell - buy;
      const marginPercent = buy > 0 ? (margin / buy) * 100 : 0;

      if (margin < 0) {
        setMarginAlert("Selling at a loss!");
      } else if (marginPercent < 10) {
        setMarginAlert("Low margin (under 10%)");
      } else {
        setMarginAlert(null);
      }
    } else {
      setMarginAlert(null);
    }
  }, [selectedProduct, quantity]);

  const handleSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
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
      setProductId('');
      setCustomerId('');
      setStaffId('');
      setQuantity('');
      setDueDate('');
      setMarginAlert(null);
    } catch (err: any) { alert(err.message || "Error"); }
  };

  return (
    <div className="pb-24 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6 mt-2">
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('sales.title')}</h1>
        <button onClick={() => setIsModalOpen(true)} className={`p-3 rounded-2xl shadow-lg shadow-primary-500/20 active:scale-95 transition-transform ${theme === 'dark' ? 'bg-primary-600 text-white' : 'bg-primary-600 text-white'}`}><Plus size={24} /></button>
      </div>

      <div className="space-y-3">
        {!recentSales ? <p className="text-center text-slate-500 mt-10">Loading...</p> : recentSales.map((sale) => (
          <div key={sale.id} className={`
            p-4 rounded-xl border shadow-sm flex justify-between items-center transition-all
            ${theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-100 hover:border-slate-200'}
          `}>
            <div className="flex items-center gap-4">
               <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-slate-800 text-primary-400' : 'bg-primary-50 text-primary-600'}`}><ShoppingCart size={20} /></div>
               <div>
                <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{sale.productName}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>{sale.quantity} pcs</span>
                  <span className={`text-[10px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{formatDate(sale.date, lang)}</span>
                  {sale.customerId && <span className="text-[10px] text-blue-500 font-medium flex items-center gap-1"><User size={10}/> Due Customer</span>}
                </div>
                {sale.dueDate && (
                   <div className="text-[10px] text-orange-500 flex items-center gap-1 mt-1">
                      <Calendar size={10} /> Due: {new Date(sale.dueDate).toLocaleDateString()}
                   </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold text-lg font-mono ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(sale.total, lang)}</p>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('sales.newSale')}>
        <form onSubmit={handleSale} className="space-y-2">
          <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{t('sales.selectProduct')}</label>
          <select className={`w-full mb-5 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`} value={productId} onChange={(e) => setProductId(e.target.value)} required>
            <option value="">Select Product</option>
            {products?.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>)}
          </select>

          <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Baki Khata (Optional)</label>
          <select className={`w-full mb-5 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`} value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
            <option value="">Cash Payment</option>
            {customers?.map(c => <option key={c.id} value={c.id}>{c.name} (Due: {c.debt})</option>)}
          </select>

          <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Sold By (Optional)</label>
          <select className={`w-full mb-5 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`} value={staffId} onChange={(e) => setStaffId(e.target.value)}>
            <option value="">Self</option>
            {staff?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>

          {selectedCustomer && (
             <div className="mb-5">
               <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Due Date (Optional)</label>
               <input 
                 type="date" 
                 className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                 value={dueDate}
                 onChange={(e) => setDueDate(e.target.value)}
               />
             </div>
          )}

          {selectedProduct && (
            <div className={`p-4 rounded-xl mb-4 border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
              <div className="flex justify-between text-sm mb-1"><span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>Price:</span><span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(selectedProduct.sellPrice, lang)}</span></div>
              <div className="flex justify-between text-sm"><span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>Stock:</span><span className={`font-bold ${selectedProduct.stock < 5 ? 'text-red-500' : (theme === 'dark' ? 'text-white' : 'text-slate-700')}`}>{selectedProduct.stock}</span></div>
            </div>
          )}

          {marginAlert && (
             <div className={`p-3 rounded-lg mb-4 flex items-center gap-2 text-xs font-bold border ${
                marginAlert.includes("loss") 
                ? "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30" 
                : "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30"
             }`}>
                <AlertTriangle size={14} /> {marginAlert}
             </div>
          )}

          <Input label={t('sales.quantity')} type="number" min="1" required value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          {selectedProduct && quantity && (
             <div className={`
                mb-4 p-4 rounded-xl flex justify-between items-center shadow-lg
                ${selectedCustomer ? 'bg-blue-600 text-white' : 'bg-primary-700 text-white'}
             `}>
                <span className="font-medium">{selectedCustomer ? 'Total Due' : 'Total'}</span>
                <span className="text-2xl font-bold font-mono">{formatCurrency(selectedProduct.sellPrice * parseInt(toEnglishDigits(quantity)), lang)}</span>
             </div>
          )}
          <Button type="submit" icon={<Check size={20} />}>Confirm Sale</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Sales;
