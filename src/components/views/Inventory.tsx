import React, { useState } from 'react';
import { Plus, Edit, Trash2, Package, Save } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import BottomSheet from '../ui/BottomSheet';
import Button from '../ui/Button';
import Card from '../ui/Card';
import AmountInput from '../ui/AmountInput';
import { UNITS, CATEGORIES } from '../../lib/constants';
import { formatCurrency } from '../../lib/utils';

const Inventory: React.FC = () => {
  const { t, lang } = useLanguage();
  const { addProduct, updateProduct, deleteProduct } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('General');
  const [unit, setUnit] = useState('pcs');
  const [buyPrice, setBuyPrice] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);
  const [stock, setStock] = useState(0);

  const products = useLiveQuery(() => db.products.orderBy('name').toArray());

  const resetForm = () => {
    setName('');
    setCategory('General');
    setUnit('pcs');
    setBuyPrice(0);
    setSellPrice(0);
    setStock(0);
    setEditingProduct(null);
  };

  const openModal = (product?: any) => {
    if (product) {
      setEditingProduct(product);
      setName(product.name);
      setCategory(product.category);
      setUnit(product.unit);
      setBuyPrice(product.buyPrice);
      setSellPrice(product.sellPrice);
      setStock(product.stock);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return alert("Product name is required");

    setIsProcessing(true);
    try {
      const data = { name, category, unit, buyPrice, sellPrice, stock };
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
      } else {
        await addProduct(data);
      }
      closeModal();
    } catch (err) {
      alert("Error saving product");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(t('common.confirmDelete'))) {
      await deleteProduct(id);
    }
  };

  return (
    <div className="pb-32 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-h1 text-prussian font-display">{t('inventory.title')}</h1>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-orange text-white px-4 py-2 rounded-md shadow-float active:scale-95 transition-transform">
          <Plus size={18} /> <span className="font-semibold">{t('inventory.addProduct')}</span>
        </button>
      </div>

      <div className="space-y-2">
        {!products || products.length === 0 ? (
          <div className="text-center py-20">
            <Package size={40} className="mx-auto text-prussian/20 mb-2"/>
            <p className="text-secondary">{t('common.noData')}</p>
          </div>
        ) : (
          products.map(product => (
            <Card key={product.id} className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-prussian">{product.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-alabaster px-2 py-0.5 rounded">{product.category}</span>
                  <span className="text-small text-secondary">Stock: {product.stock} {product.unit}</span>
                </div>
                <div className="flex gap-3 mt-1 text-sm">
                  <span className="text-secondary">Buy: {formatCurrency(product.buyPrice, lang)}</span>
                  <span className="text-orange font-bold">Sell: {formatCurrency(product.sellPrice, lang)}</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openModal(product)} className="p-2 text-prussian/60 hover:bg-alabaster rounded-full active:scale-90 transition-all"><Edit size={16}/></button>
                <button onClick={() => handleDelete(product.id!)} className="p-2 text-red-400 hover:bg-red-50 rounded-full active:scale-90 transition-all"><Trash2 size={16}/></button>
              </div>
            </Card>
          ))
        )}
      </div>

      <BottomSheet 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={editingProduct ? t('common.edit') : t('inventory.addProduct')}
        footer={<Button onClick={handleSave} isLoading={isProcessing} icon={<Save size={18} />}>{t('common.save')}</Button>}
      >
        <div className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-small font-semibold mb-2 text-prussian">{t('inventory.productName')}</label>
            <input 
              type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full h-[50px] bg-white border border-gray-border rounded-md px-4 focus:ring-2 focus:ring-orange focus:outline-none"
            />
          </div>

          {/* Category & Unit Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-small font-semibold mb-2 text-prussian">{t('inventory.category')}</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-[50px] bg-white border border-gray-border rounded-md px-4 focus:ring-2 focus:ring-orange focus:outline-none">
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{lang === 'bn' ? c.labelBn : c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-small font-semibold mb-2 text-prussian">Unit</label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full h-[50px] bg-white border border-gray-border rounded-md px-4 focus:ring-2 focus:ring-orange focus:outline-none">
                {UNITS.map(u => <option key={u.value} value={u.value}>{lang === 'bn' ? u.labelBn : u.label}</option>)}
              </select>
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-3">
             <AmountInput value={buyPrice} onChange={setBuyPrice} label={t('inventory.buyPrice')} />
             <AmountInput value={sellPrice} onChange={setSellPrice} label={t('inventory.sellPrice')} />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-small font-semibold mb-2 text-prussian">{t('inventory.stock')}</label>
            <input 
              type="number" step="any" value={stock} onChange={(e) => setStock(parseFloat(e.target.value) || 0)}
              className="w-full h-[50px] bg-white border border-gray-border rounded-md px-4 focus:ring-2 focus:ring-orange focus:outline-none text-prussian font-bold"
            />
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};

export default Inventory;
