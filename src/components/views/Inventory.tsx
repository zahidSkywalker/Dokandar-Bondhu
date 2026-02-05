import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Package, AlertTriangle } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { formatCurrency, toEnglishDigits } from '../../lib/utils';

const Inventory: React.FC = () => {
  const { t, lang } = useLanguage();
  const { addProduct, deleteProduct, getLastPurchasePrice } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [marginWarning, setMarginWarning] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    buyPrice: '',
    sellPrice: '',
    stock: '',
    category: 'General',
    unit: 'pcs'
  });

  const products = useLiveQuery(
    () => db.products
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .toArray(),
    [searchTerm]
  );

  useEffect(() => {
    const checkMargin = async () => {
      if (formData.buyPrice && formData.sellPrice) {
        const buy = parseFloat(toEnglishDigits(formData.buyPrice));
        const sell = parseFloat(toEnglishDigits(formData.sellPrice));
        
        if (isNaN(buy) || isNaN(sell)) return;

        const margin = sell - buy;
        const marginPercent = buy > 0 ? (margin / buy) * 100 : 0;

        if (sell < buy) {
          setMarginWarning("Warning: Selling below cost price!");
        } else if (marginPercent < 10) {
          setMarginWarning("Warning: Margin is low (< 10%).");
        } else {
          setMarginWarning(null);
        }
      }
    };
    checkMargin();
  }, [formData.buyPrice, formData.sellPrice]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProduct({
        name: formData.name,
        buyPrice: parseFloat(toEnglishDigits(formData.buyPrice)),
        sellPrice: parseFloat(toEnglishDigits(formData.sellPrice)),
        stock: parseInt(toEnglishDigits(formData.stock)),
        category: formData.category,
        unit: formData.unit
      });
      setIsModalOpen(false);
      setFormData({ name: '', buyPrice: '', sellPrice: '', stock: '', category: 'General', unit: 'pcs' });
      setMarginWarning(null);
    } catch (err) {
      alert("Error adding product");
    }
  };

  return (
    <div className="pb-24 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6 mt-2">
        <h1 className={`text-2xl font-bold ${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'text-white' : 'text-slate-900'}`}>{t('inventory.title')}</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 text-white p-3 rounded-2xl shadow-lg shadow-primary-500/20 active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
        <input 
          type="text"
          placeholder={t('common.search')}
          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-slate-900 dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {!products ? (
          <p className="text-center text-slate-500 mt-10">Loading...</p>
        ) : products.length === 0 ? (
           <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
             <Package className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={48} />
             <p className="text-slate-500 dark:text-slate-400 font-medium">{t('common.noData')}</p>
           </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex justify-between items-center hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{product.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  Buy: {formatCurrency(product.buyPrice, lang)} • Sell: {formatCurrency(product.sellPrice, lang)}
                </p>
                <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${
                  product.stock < 10 
                    ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30' 
                    : 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${product.stock < 10 ? 'bg-red-500' : 'bg-emerald-500'}`} />
                  Stock: {product.stock} {product.unit}
                </div>
                 {(product.sellPrice - product.buyPrice) < (product.buyPrice * 0.1) && product.buyPrice > 0 && (
                    <div className="mt-2 text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <AlertTriangle size={10}/> Low Margin
                    </div>
                 )}
              </div>
              <button onClick={() => deleteProduct(product.id!)} className="bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 text-slate-400 p-3 rounded-xl transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('inventory.addProduct')}>
        <form onSubmit={handleAdd} className="space-y-2">
          <Input 
            label={t('inventory.productName')} 
            required 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label={t('inventory.buyPrice')} 
              type="number" 
              required 
              value={formData.buyPrice} 
              onChange={(e) => setFormData({...formData, buyPrice: e.target.value})} 
            />
            <Input 
              label={t('inventory.sellPrice')} 
              type="number" 
              required 
              value={formData.sellPrice} 
              onChange={(e) => setFormData({...formData, sellPrice: e.target.value})} 
            />
          </div>
          
          {marginWarning && (
            <div className={`p-3 rounded-xl text-xs font-bold mb-2 flex items-center gap-2 border ${
              marginWarning.includes("below cost") 
                ? "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30" 
                : "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30"
            }`}>
              <AlertTriangle size={14} />
              {marginWarning}
            </div>
          )}

          <Input 
            label={t('inventory.stock')} 
            type="number" 
            required 
            value={formData.stock} 
            onChange={(e) => setFormData({...formData, stock: e.target.value})} 
          />
          <div className="grid grid-cols-2 gap-4">
             <Input 
              label={t('inventory.category')} 
              value={formData.category} 
              onChange={(e) => setFormData({...formData, category: e.target.value})} 
            />
             <Input 
              label="Unit"
              value={formData.unit} 
              onChange={(e) => setFormData({...formData, unit: e.target.value})} 
            />
          </div>
          <div className="h-6" />
          <Button icon={<Plus size={20} />}>{t('common.save')}</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Inventory;
