import React, { useState, useMemo } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { formatCurrency, toEnglishDigits } from '../../lib/utils';

const Inventory: React.FC = () => {
  const { t, lang } = useLanguage(); // Corrected: toEnglishDigits is NOT from useLanguage
  const { addProduct, deleteProduct } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
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
    } catch (err) {
      alert("Error adding product");
    }
  };

  return (
    <div className="pb-24 px-4 pt-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">{t('inventory.title')}</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-teal-600 text-white p-3 rounded-full shadow-lg active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
        <input 
          type="text"
          placeholder={t('common.search')}
          className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-teal-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {!products ? (
          <p className="text-center text-gray-500 mt-10">Loading...</p>
        ) : products.length === 0 ? (
           <p className="text-center text-gray-400 mt-10">{t('common.noData')}</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-800">{product.name}</h3>
                <p className="text-xs text-gray-500">
                  Buy: {formatCurrency(product.buyPrice, lang)} | Sell: {formatCurrency(product.sellPrice, lang)}
                </p>
                <div className={`mt-2 inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                  product.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}>
                  Stock: {product.stock} {product.unit}
                </div>
              </div>
              <button onClick={() => deleteProduct(product.id!)} className="text-gray-400 hover:text-red-500 p-2">
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Product Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('inventory.addProduct')}>
        <form onSubmit={handleAdd}>
          <Input 
            label={t('inventory.productName')} 
            required 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
          />
          <div className="flex gap-4">
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
          <Input 
            label={t('inventory.stock')} 
            type="number" 
            required 
            value={formData.stock} 
            onChange={(e) => setFormData({...formData, stock: e.target.value})} 
          />
          <div className="flex gap-4">
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
          <div className="h-4" />
          <Button>{t('common.save')}</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Inventory;
