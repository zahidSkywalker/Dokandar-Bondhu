import React, { useState, useMemo } from 'react';
import { Search, ShoppingCart, User, Plus, Minus, Check, Package, TrendingUp } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import BottomSheet from '../ui/BottomSheet';
import Button from '../ui/Button';
import Card from '../ui/Card';
import FlowAnimation from '../ui/FlowAnimation';
import AmountInput from '../ui/AmountInput';
import { formatCurrency, toEnglishDigits } from '../../lib/utils';

const Sales: React.FC = () => {
  const { t, lang } = useLanguage();
  const { addSale } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [customerId, setCustomerId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFlowAnimation, setShowFlowAnimation] = useState(false);
  const [customAmount, setCustomAmount] = useState<number>(0);

  const products = useLiveQuery(() => db.products.where('stock').above(0).toArray(), []);
  const customers = useLiveQuery(() => db.customers.toArray());
  const recentSales = useLiveQuery(() => db.sales.orderBy('date').reverse().limit(5).toArray(), []);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const openSaleModal = (product: any) => {
    setSelectedProduct(product);
    setQuantity('1');
    setCustomerId('');
    setCustomAmount(0);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setQuantity('1');
    setCustomerId('');
    setCustomAmount(0);
  };

  const handleSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    const qty = parseFloat(toEnglishDigits(quantity));
    if (isNaN(qty) || qty <= 0) return alert("Invalid quantity");
    if (qty > selectedProduct.stock) return alert(`Insufficient stock. Available: ${selectedProduct.stock} ${selectedProduct.unit}`);

    setIsProcessing(true);
    try {
      const standardTotal = selectedProduct.sellPrice * qty;
      const finalTotal = customAmount > 0 ? customAmount : standardTotal;
      
      await addSale({
        productId: selectedProduct.id!,
        productName: selectedProduct.name,
        quantity: qty,
        buyPrice: selectedProduct.buyPrice,
        sellPrice: finalTotal / qty,
        date: new Date(),
        customerId: customerId ? Number(customerId) : undefined,
        unit: selectedProduct.unit,
      });

      setShowFlowAnimation(true);
      setTimeout(() => {
        closeModal();
        setIsProcessing(false);
      }, 1000);
    } catch (err: any) { 
      alert(err.message || "Error processing sale"); 
      setIsProcessing(false);
    }
  };

  const adjustQuantity = (amount: number) => {
    const current = parseFloat(toEnglishDigits(quantity)) || 0;
    const newQty = Math.max(0.1, current + amount);
    setQuantity(String(newQty));
  };

  const standardTotal = selectedProduct ? selectedProduct.sellPrice * parseFloat(toEnglishDigits(quantity) || '0') : 0;
  const profitValue = selectedProduct 
    ? (customAmount > 0 ? customAmount : standardTotal) - (selectedProduct.buyPrice * parseFloat(toEnglishDigits(quantity) || '0'))
    : 0;

  return (
    <div className="pb-32 animate-fade-in">
      <FlowAnimation trigger={showFlowAnimation} color="#FCA311" />

      <div className="mb-6">
        <h1 className="text-h1 text-prussian font-display mb-4">{t('sales.title')}</h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-prussian/40 w-5 h-5" />
          <input 
            type="text" 
            placeholder={t('sales.searchPlaceholder')}
            className="w-full bg-white border border-gray-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange/20 text-body text-prussian shadow-card"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-small font-semibold text-secondary uppercase tracking-wide mb-3 px-1">{t('sales.inStock')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {!filteredProducts ? (
             <div className="col-span-full text-center py-10 text-secondary">{t('common.loading')}</div>
          ) : filteredProducts.length === 0 ? (
             <div className="col-span-full flex flex-col items-center justify-center py-10 text-center bg-white rounded-2xl border-dashed border-2 border-gray-border">
               <Package size={40} className="text-prussian/20 mb-2" />
               <p className="text-sm font-medium text-secondary">{t('sales.noProducts')}</p>
             </div>
          ) : (
            filteredProducts.map((product, i) => (
              <button
                key={product.id}
                onClick={() => openSaleModal(product)}
                className="bg-white p-4 rounded-2xl shadow-card flex flex-col items-center justify-between text-left transition-all hover:shadow-float active:scale-[0.98] min-h-[140px] border border-transparent hover:border-orange/20"
              >
                <div className="w-full flex justify-between items-start mb-2">
                   <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${product.stock < 5 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                     {product.stock} left
                   </span>
                 </div>
                <div className="flex-1 flex items-center justify-center w-full">
                  <h3 className="text-sm font-bold text-prussian text-center leading-tight line-clamp-2">{product.name}</h3>
                </div>
                <div className="w-full mt-2 flex justify-between items-end">
                   <span className="text-xs text-secondary font-medium truncate">{product.category}</span>
                   <span className="text-base font-bold text-orange">{formatCurrency(product.sellPrice, lang)}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {recentSales && recentSales.length > 0 && (
        <div className="mt-6">
          <h2 className="text-small font-semibold text-secondary uppercase tracking-wide mb-3 px-1">{t('sales.recent')}</h2>
          <div className="space-y-2">
             {recentSales.map(sale => (
               <Card key={sale.id} className="flex items-center justify-between p-4">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-alabaster rounded-xl text-prussian"><ShoppingCart size={14}/></div>
                   <div>
                     <p className="text-sm font-semibold text-prussian">{sale.productName}</p>
                     <p className="text-small text-secondary">{sale.quantity} {sale.unit || 'pcs'}</p>
                   </div>
                 </div>
                 <p className="text-base font-bold text-prussian">{formatCurrency(sale.total, lang)}</p>
               </Card>
             ))}
          </div>
        </div>
      )}

      <BottomSheet 
        isOpen={!!selectedProduct} 
        onClose={closeModal} 
        title={selectedProduct?.name || t('sales.newSale')}
        footer={
          selectedProduct && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm px-1">
                 <span className="text-secondary flex items-center gap-1"><TrendingUp size={12}/> {t('sales.profit')}</span>
                 <span className={`font-bold ${profitValue < 0 ? 'text-red-500' : 'text-green-600'}`}>
                   {profitValue < 0 ? '-' : '+'}{formatCurrency(Math.abs(profitValue), lang)}
                 </span>
              </div>
              <Button onClick={handleSale} isLoading={isProcessing} icon={<Check size={20} />}>
                {customerId ? t('sales.confirmDue') : t('sales.confirmCash')}
              </Button>
            </div>
          )
        }
      >
        {selectedProduct && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-alabaster p-4 rounded-xl">
              <div>
                <p className="text-small text-secondary mb-1">Price per {selectedProduct.unit}</p>
                <p className="text-2xl font-bold text-prussian">{formatCurrency(selectedProduct.sellPrice, lang)}</p>
              </div>
              <div className="text-right">
                <p className="text-small text-secondary mb-1">{t('sales.inStock')}</p>
                <p className={`text-xl font-bold ${selectedProduct.stock < 5 ? 'text-red-500' : 'text-prussian'}`}>{selectedProduct.stock}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-prussian">{t('sales.quantity')}</label>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => adjustQuantity(-1)} className="bg-alabaster text-prussian p-3 rounded-xl font-bold text-lg hover:bg-gray-200 active:scale-95 transition-all h-[52px] w-[52px] flex items-center justify-center"><Minus size={20} /></button>
                <input 
                  type="number" step="any"
                  className="flex-1 text-center text-xl font-bold bg-white border border-gray-border rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-orange/20 text-prussian h-[52px]"
                  value={quantity} onChange={(e) => setQuantity(e.target.value)} required
                />
                <button type="button" onClick={() => adjustQuantity(1)} className="bg-alabaster text-prussian p-3 rounded-xl font-bold text-lg hover:bg-gray-200 active:scale-95 transition-all h-[52px] w-[52px] flex items-center justify-center"><Plus size={20} /></button>
              </div>
            </div>

            <AmountInput value={customAmount} onChange={setCustomAmount} label={t('sales.customAmount')} placeholder={t('sales.standardPrice')} />

            <div>
              <label className="block text-sm font-bold mb-2 text-prussian flex items-center gap-1"><User size={12} /> {t('ledger.title')}</label>
              <select 
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-border text-prussian focus:ring-2 focus:ring-orange/20 h-[52px]"
                value={customerId} onChange={(e) => setCustomerId(e.target.value)}
              >
                <option value="">{t('sales.confirmCash')}</option>
                {customers?.map(c => <option key={c.id} value={c.id}>{c.name} ({t('ledger.debt')}: {formatCurrency(c.debt, lang)})</option>)}
              </select>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-border">
              <span className="text-base text-secondary">{t('sales.total')}</span>
              <span className="text-2xl font-bold text-prussian">{formatCurrency(customAmount > 0 ? customAmount : standardTotal, lang)}</span>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
};

export default Sales;
