import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Check, ShoppingCart, User, AlertTriangle } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import FlowAnimation from '../ui/FlowAnimation';
import { formatCurrency, formatDate, toEnglishDigits } from '../../lib/utils';

const Sales: React.FC = () => {
  const { t, lang } = useLanguage();
  const { addSale } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productId, setProductId] = useState<string>('');
  const [customerId, setCustomerId] = useState<string>('');
  const [quantity, setQuantity] = useState('');
  const [marginAlert, setMarginAlert] = useState<string | null>(null);
  const [showFlowAnimation, setShowFlowAnimation] = useState(false);

  const products = useLiveQuery(() => db.products.toArray());
  const customers = useLiveQuery(() => db.customers.toArray());
  const recentSales = useLiveQuery(() => db.sales.orderBy('date').reverse().limit(10).toArray(), []);

  const selectedProduct = useMemo(() => products?.find(p => p.id === Number(productId)), [productId, products]);

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
      });
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) { 
      alert(err.message || "Error"); 
      setShowFlowAnimation(false);
    }
  };
  
  const resetForm = () => {
    setProductId(''); setCustomerId(''); setQuantity(''); setMarginAlert(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <FlowAnimation trigger={showFlowAnimation} color="#FCA311" />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-prussian font-display">{t('sales.title')}</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-orange text-prussian p-3 rounded-2xl shadow-xl active:scale-95 transition-transform">
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-3">
        {!recentSales ? <div className="text-center p-8">Loading...</div> : recentSales.map((sale, i) => (
          <div 
            key={sale.id} 
            className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center border border-gray-100 stagger-item"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-center gap-4">
               <div className="p-2 rounded-xl bg-alabaster text-prussian"><ShoppingCart size={20} /></div>
               <div>
                <h3 className="font-bold text-prussian">{sale.productName}</h3>
                <div className="text-xs text-prussian/50">
                  {formatDate(sale.date, lang)} • {sale.quantity} pcs
                </div>
                {sale.customerId && <span className="text-[10px] text-blue-500 flex items-center gap-1"><User size={10}/> Due</span>}
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-xl text-prussian">{formatCurrency(sale.total, lang)}</p>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={t('sales.newSale')}>
        <form onSubmit={handleSale} className="space-y-2">
          <select className="w-full mb-2 px-4 py-3 rounded-xl bg-white border border-gray-200 text-prussian" value={productId} onChange={(e) => setProductId(e.target.value)} required>
            <option value="">Select Product</option>
            {products?.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>)}
          </select>
          <select className="w-full mb-2 px-4 py-3 rounded-xl bg-white border border-gray-200 text-prussian" value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
            <option value="">Cash Payment</option>
            {customers?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          
          {marginAlert && (
             <div className="p-3 rounded-lg mb-4 flex items-center gap-2 text-xs font-bold bg-red-50 text-red-600 border border-red-100">
                <AlertTriangle size={14} /> {marginAlert}
             </div>
          )}

          <Input label={t('sales.quantity')} type="number" min="1" required value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          {selectedProduct && quantity && (
             <div className="mb-4 p-4 rounded-xl flex justify-between items-center shadow-lg bg-prussian text-white">
                <span className="font-medium">Total</span>
                <span className="text-2xl font-bold font-display">{formatCurrency(selectedProduct.sellPrice * parseInt(toEnglishDigits(quantity)), lang)}</span>
             </div>
          )}
          <Button type="submit" icon={<Check size={20} />}>Confirm Sale</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Sales;
