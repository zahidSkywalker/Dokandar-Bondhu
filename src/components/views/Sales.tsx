import React, { useState, useMemo } from 'react';
import { Plus, Check, ShoppingCart } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { formatCurrency, formatDate, toEnglishDigits } from '../../lib/utils';

const Sales: React.FC = () => {
  const { t, lang } = useLanguage();
  const { addSale } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productId, setProductId] = useState<string>('');
  const [quantity, setQuantity] = useState('');

  const products = useLiveQuery(() => db.products.toArray());
  const recentSales = useLiveQuery(
    () => db.sales.orderBy('date').reverse().limit(10).toArray(),
    []
  );

  const selectedProduct = useMemo(() => {
    return products?.find(p => p.id === Number(productId));
  }, [productId, products]);

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
        date: new Date()
      });
      setIsModalOpen(false);
      setProductId('');
      setQuantity('');
    } catch (err: any) {
      alert(err.message || "Error processing sale");
    }
  };

  return (
    <div className="pb-24 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6 mt-2">
        <h1 className="text-2xl font-bold text-earth-900">{t('sales.title')}</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-earth-800 text-white p-3 rounded-2xl shadow-xl shadow-earth-900/30 active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-4">
        {!recentSales ? <p>Loading...</p> : (
          recentSales.map((sale) => (
            <div key={sale.id} className="bg-white p-5 rounded-2xl border border-cream-200 shadow-sm flex justify-between items-center">
              <div className="flex items-center gap-4">
                 <div className="bg-cream-100 p-2 rounded-xl text-earth-600">
                    <ShoppingCart size={20} />
                 </div>
                 <div>
                  <h3 className="font-bold text-earth-900">{sale.productName}</h3>
                  <p className="text-xs text-earth-500">{formatDate(sale.date, lang)} • {sale.quantity} pcs</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl text-earth-800">{formatCurrency(sale.total, lang)}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('sales.newSale')}>
        <form onSubmit={handleSale} className="space-y-2">
          <label className="block text-sm font-bold text-earth-700 mb-1">{t('sales.selectProduct')}</label>
          <select 
            className="w-full mb-2 px-4 py-3 bg-white border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-200 text-earth-800"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
          >
            <option value="">-- Select Product --</option>
            {products?.map(p => (
              <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>
            ))}
          </select>

          {selectedProduct && (
            <div className="bg-cream-50 p-4 rounded-xl mb-4 border border-cream-100">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-earth-500">Selling Price:</span>
                <span className="font-bold text-earth-800">{formatCurrency(selectedProduct.sellPrice, lang)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-earth-500">Available:</span>
                <span className={`font-bold ${selectedProduct.stock < 5 ? 'text-red-500' : 'text-earth-700'}`}>
                  {selectedProduct.stock}
                </span>
              </div>
            </div>
          )}

          <Input 
            label={t('sales.quantity')}
            type="number" 
            min="1"
            required 
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value)} 
          />
          
          {selectedProduct && quantity && (
             <div className="mb-4 p-4 bg-earth-800 rounded-xl flex justify-between items-center shadow-lg">
                <span className="text-earth-100 font-medium">Total</span>
                <span className="text-2xl font-bold text-white">
                  {formatCurrency(selectedProduct.sellPrice * parseInt(toEnglishDigits(quantity)), lang)}
                </span>
             </div>
          )}

          <Button type="submit" icon={<Check size={20} />}>Confirm Sale</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Sales;
