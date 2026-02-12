import React, { useState, useRef } from 'react';
import { Plus, Search, Trash2, Package, Edit3, AlertTriangle, ChevronLeft } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import { formatCurrency, toEnglishDigits } from '../../lib/utils';

const Inventory: React.FC = () => {
  const { t, lang } = useLanguage();
  const { theme } = useTheme();
  const { addProduct, deleteProduct, updateProduct, getLastPurchasePrice } = useApp();
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

  const handleAdd = async (e: React.FormEvent) => {
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
      name: product.name,
      buyPrice: String(product.buyPrice),
      sellPrice: String(product.sellPrice),
      stock: String(product.stock),
      category: product.category,
      unit: product.unit
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({ name: '', buyPrice: '', sellPrice: '', stock: '', category: 'General', unit: 'pcs' });
  };

  // Swipe Logic
  const [swipedId, setSwipedId] = useState<number | null>(null);
  const touchStartX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent, id: number) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent, id: number) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    if (diff > 50) {
      setSwipedId(id); // Swipe Left Open
    } else if (diff < -50) {
      setSwipedId(null); // Swipe Right Close
    }
  };

  return (
    <div className="pb-24 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6 mt-2">
        <h1 className="text-2xl font-bold text-earth-900 dark:text-white">{t('inventory.title')}</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white p-3 rounded-2xl shadow-xl active:scale-95 transition-transform">
          <Plus size={24} />
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-3.5 text-earth-400 w-5 h-5" />
        <input 
          type="text" placeholder={t('common.search')}
          className="w-full bg-white dark:bg-gray-800 border border-cream-200 dark:border-gray-700 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-earth-900 dark:text-white"
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {!products ? <InventorySkeleton /> : products.length === 0 ? (
           <div className="p-16 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl">
             <Package className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={64} />
             <p className="text-xl font-medium text-gray-500 dark:text-gray-400">Inventory Empty</p>
             <button onClick={() => setIsModalOpen(true)} className="mt-4 bg-primary/10 text-primary px-6 py-3 rounded-xl font-bold">
               Add First Product
             </button>
           </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="relative overflow-hidden rounded-2xl" onTouchStart={(e) => handleTouchStart(e, product.id!)} onTouchEnd={(e) => handleTouchEnd(e, product.id!)}>
              {/* Background Actions (Revealed on Swipe) */}
              <div className={`absolute top-0 right-0 h-full w-24 flex items-center justify-end transition-transform duration-200 pr-4 gap-2 ${swipedId === product.id ? 'translate-x-0' : 'translate-x-full'}`}>
                <button onClick={() => { openEditModal(product); setSwipedId(null); }} className="p-3 bg-blue-500 text-white rounded-full shadow-lg"><Edit3 size={18} /></button>
                <button onClick={() => { deleteProduct(product.id!); setSwipedId(null); }} className="p-3 bg-red-500 text-white rounded-full shadow-lg"><Trash2 size={18} /></button>
              </div>

              {/* Content */}
              <div className={`bg-white dark:bg-gray-800 p-4 border shadow-sm flex justify-between items-center transition-transform duration-200 ${swipedId === product.id ? '-translate-x-24' : 'translate-x-0'} ${theme === 'dark' ? 'border-gray-700' : 'border-cream-200'}`}>
                <div>
                  <h3 className="font-bold text-earth-900 dark:text-white text-lg">{product.name}</h3>
                  <p className="text-xs text-earth-500 dark:text-gray-400 mt-1 font-medium">
                    Buy: {formatCurrency(product.buyPrice, lang)} • Sell: {formatCurrency(product.sellPrice, lang)}
                  </p>
                  <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                    product.stock < 10 ? 'bg-red-50 text-red-600 border border-red-100 dark:bg-red-900/20 dark:border-red-900 dark:text-red-400' : 'bg-green-50 text-green-600 border border-green-100 dark:bg-green-900/20 dark:border-green-900 dark:text-green-400'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${product.stock < 10 ? 'bg-red-500' : 'bg-green-500'}`} />
                    Stock: {product.stock} {product.unit}
                  </div>
                </div>
                 {/* Visual Cue for Swipe */}
                <ChevronLeft className="text-gray-300 dark:text-gray-600" size={20} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingProduct ? "Edit Product" : t('inventory.addProduct')}>
        <form onSubmit={handleAdd} className="space-y-2">
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

const InventorySkeleton = () => (
  <div className="space-y-3">
    {[1,2,3].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
  </div>
);

export default Inventory;
