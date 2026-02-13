import React, { useState } from 'react';
import { Plus, Search, Trash2, Package, Edit3, AlertTriangle } from 'lucide-react';
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
  const { addProduct, deleteProduct, updateProduct } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', buyPrice: '', sellPrice: '', stock: '', category: 'General', unit: 'pcs'
  });

  const products = useLiveQuery(
    () => db.products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).toArray(),
    [searchTerm]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, {
          name: formData.name,
          buyPrice: parseFloat(toEnglishDigits(formData.buyPrice)),
          sellPrice: parseFloat(toEnglishDigits(formData.sellPrice)),
          stock: parseInt(toEnglishDigits(formData.stock)),
          category: formData.category,
          unit: formData.unit
        });
      } else {
        await addProduct({
          name: formData.name,
          buyPrice: parseFloat(toEnglishDigits(formData.buyPrice)),
          sellPrice: parseFloat(toEnglishDigits(formData.sellPrice)),
          stock: parseInt(toEnglishDigits(formData.stock)),
          category: formData.category,
          unit: formData.unit
        });
      }
      closeModal();
    } catch (err) { alert("Error saving product"); }
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name, buyPrice: String(product.buyPrice), sellPrice: String(product.sellPrice),
      stock: String(product.stock), category: product.category, unit: product.unit
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({ name: '', buyPrice: '', sellPrice: '', stock: '', category: 'General', unit: 'pcs' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-prussian font-display">{t('inventory.title')}</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-orange text-prussian p-3 rounded-2xl shadow-xl active:scale-95 transition-transform">
          <Plus size={24} />
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-3.5 text-prussian/40 w-5 h-5" />
        <input 
          type="text" placeholder={t('common.search')}
          className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange focus:border-orange transition-all text-prussian"
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {!products ? (
            <div className="text-center p-8 text-prussian">Loading...</div>
        ) : products.length === 0 ? (
           <div className="p-16 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white">
             <Package className="mx-auto text-prussian/20 mb-4" size={64} />
             <p className="text-xl font-medium text-prussian/50">Inventory Empty</p>
             <button onClick={() => setIsModalOpen(true)} className="mt-4 bg-orange/10 text-orange px-6 py-3 rounded-xl font-bold hover:bg-orange/20 transition-colors">
               Add First Product
             </button>
           </div>
        ) : (
          products.map((product, i) => (
            <div 
                key={product.id} 
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center stagger-item"
                style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex-1">
                <h3 className="font-bold text-prussian text-lg">{product.name}</h3>
                <p className="text-xs text-prussian/50 mt-1 font-medium">
                  Buy: {formatCurrency(product.buyPrice, lang)} • Sell: {formatCurrency(product.sellPrice, lang)}
                </p>
                <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                  product.stock < 10 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${product.stock < 10 ? 'bg-red-500' : 'bg-green-500'}`} />
                  Stock: {product.stock} {product.unit}
                </div>
              </div>
              
              <div className="flex gap-2 ml-4">
                <button onClick={() => openEditModal(product)} className="p-3 rounded-xl bg-alabaster hover:bg-gray-200 transition-colors">
                   <Edit3 size={18} className="text-prussian/60" />
                </button>
                <button onClick={() => deleteProduct(product.id!)} className="p-3 rounded-xl bg-red-50 hover:bg-red-100 transition-colors">
                   <Trash2 size={18} className="text-red-500" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingProduct ? "Edit Product" : t('inventory.addProduct')}>
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input label={t('inventory.productName')} required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <Input label={t('inventory.buyPrice')} type="number" required value={formData.buyPrice} onChange={(e) => setFormData({...formData, buyPrice: e.target.value})} />
            <Input label={t('inventory.sellPrice')} type="number" required value={formData.sellPrice} onChange={(e) => setFormData({...formData, sellPrice: e.target.value})} />
          </div>
          <Input label={t('inventory.stock')} type="number" required value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
             <Input label={t('inventory.category')} value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
             <Input label="Unit" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} />
          </div>
          <div className="h-6" />
          <Button icon={<Plus size={20} />}>{editingProduct ? "Update" : t('common.save')}</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Inventory;
