import React, { useState, useMemo } from 'react';
import { Plus, Check } from 'lucide-react'; // Removed unused ShoppingCart
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { formatCurrency, formatDate, toEnglishDigits } from '../../lib/utils'; // <--- ADDED formatDate

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
    <div className="pb-24 px-4 pt-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t('sales.title')}</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-teal-600 text-white p-3 rounded-full shadow-lg active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-4">
        {!recentSales ? <p>Loading...</p> : (
          recentSales.map((sale) => (
            <div key={sale.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-800">{sale.productName}</h3>
                <p className="text-xs text-gray-500">
                   {formatDate(sale.date, lang)} • {sale.quantity} pcs
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-teal-700">{formatCurrency(sale.total, lang)}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('sales.newSale')}>
        <form onSubmit={handleSale}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('sales.selectProduct')}</label>
          <select 
            className="w-full mb-4 px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
            <div className="bg-gray-50 p-3 rounded-lg mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Selling Price:</span>
                <span className="font-bold">{formatCurrency(selectedProduct.sellPrice, lang)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Available Stock:</span>
                <span className={`font-bold ${selectedProduct.stock < 5 ? 'text-red-500' : 'text-green-600'}`}>
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
             <div className="mb-4 p-3 bg-teal-50 border border-teal-100 rounded-lg flex justify-between items-center">
                <span className="text-teal-800 font-medium">Total:</span>
                <span className="text-xl font-bold text-teal-700">
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
