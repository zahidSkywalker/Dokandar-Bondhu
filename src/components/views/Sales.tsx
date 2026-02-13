import React, { useState, useMemo } from 'react';
import { Search, ShoppingCart, User, Plus, Minus, Check, Package } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import FlowAnimation from '../ui/FlowAnimation';
import { formatCurrency, toEnglishDigits } from '../../lib/utils';

const Sales: React.FC = () => {
  const { t, lang } = useLanguage();
  const { addSale } = useApp();
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [customerId, setCustomerId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFlowAnimation, setShowFlowAnimation] = useState(false);

  // Data
  const products = useLiveQuery(() => 
    db.products.where('stock').above(0).toArray(), 
  []);
  const customers = useLiveQuery(() => db.customers.toArray());
  const recentSales = useLiveQuery(() => db.sales.orderBy('date').reverse().limit(5).toArray(), []);

  // Filtered Products for Grid
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // Handlers
  const openSaleModal = (product: any) => {
    setSelectedProduct(product);
    setQuantity('1'); 
    setCustomerId(''); 
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setQuantity('1');
    setCustomerId('');
  };

  const handleSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    const qty = parseFloat(toEnglishDigits(quantity));
    if (isNaN(qty) || qty <= 0) {
      alert("Invalid quantity");
      return;
    }

    if (qty > selectedProduct.stock) {
      alert(`Insufficient stock. Available: ${selectedProduct.stock} ${selectedProduct.unit}`);
      return;
    }

    setIsProcessing(true);
    try {
      await addSale({
        productId: selectedProduct.id!,
        productName: selectedProduct.name,
        quantity: qty,
        buyPrice: selectedProduct.buyPrice,
        sellPrice: selectedProduct.sellPrice,
        date: new Date(),
        customerId: customerId ? Number(customerId) : undefined,
        unit: selectedProduct.unit, // FIX: Passing unit here
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
    const current = parseFloat(quantity) || 0;
    const newQty = Math.max(0.1, current + amount); 
    setQuantity(String(newQty));
  };

  return (
    <div className="pb-32 animate-fade-in">
      <FlowAnimation trigger={showFlowAnimation} color="#FCA311" />

      {/* Header Section */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-prussian font-display mb-4">{t('sales.title')}</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-prussian/40 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search products..."
            className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange focus:border-orange transition-all text-prussian shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {!filteredProducts ? (
           <div className="col-span-3 text-center py-10 text-prussian/50">Loading inventory...</div>
        ) : filteredProducts.length === 0 ? (
           <div className="col-span-3 flex flex-col items-center justify-center py-10 text-center bg-white rounded-2xl border border-gray-100 border-dashed">
             <Package size={40} className="text-prussian/20 mb-2" />
             <p className="text-sm font-medium text-prussian/50">No products found</p>
           </div>
        ) : (
          filteredProducts.map((product, i) => (
            <button
              key={product.id}
              onClick={() => openSaleModal(product)}
              className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-between text-left transition-all hover:border-orange active:scale-95 h-36 stagger-item"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div className="w-full flex justify-between items-start mb-1">
                 <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                   product.stock < 5 
                     ? 'bg-red-50 text-red-500' 
                     : 'bg-green-50 text-green-600'
                 }`}>
                   {product.stock} {product.unit}
                 </span>
                 <span className="text-xs font-bold text-orange">{formatCurrency(product.sellPrice, lang)}</span>
              </div>
              
              <div className="flex-1 flex items-center justify-center w-full">
                <h3 className="text-sm font-bold text-prussian text-center leading-tight line-clamp-2">
                  {product.name}
                </h3>
              </div>
              
              <div className="w-full mt-1 text-center">
                 <span className="text-[9px] text-prussian/40 font-medium">{product.category}</span>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Recent Sales Summary */}
      {recentSales && recentSales.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-bold text-prussian/60 mb-2 px-1">Recent Transactions</h3>
          <div className="space-y-2">
             {recentSales.map(sale => (
               <div key={sale.id} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-alabaster rounded-lg text-prussian"><ShoppingCart size={14}/></div>
                   <div>
                     <p className="text-xs font-bold text-prussian">{sale.productName}</p>
                     <p className="text-[10px] text-prussian/40">
                       {sale.quantity} {sale.unit || 'pcs'}
                     </p>
                   </div>
                 </div>
                 <p className="text-sm font-bold text-prussian">{formatCurrency(sale.total, lang)}</p>
               </div>
             ))}
          </div>
        </div>
      )}

      {/* Sale Modal */}
      <Modal isOpen={!!selectedProduct} onClose={closeModal} title={selectedProduct?.name || 'New Sale'}>
        {selectedProduct && (
          <form onSubmit={handleSale} className="space-y-4">
            
            <div className="flex justify-between items-center bg-alabaster p-4 rounded-xl mb-2">
              <div>
                <p className="text-xs text-prussian/50">Price per {selectedProduct.unit}</p>
                <p className="text-2xl font-bold text-prussian font-display">{formatCurrency(selectedProduct.sellPrice, lang)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-prussian/50">In Stock</p>
                <p className={`text-lg font-bold ${selectedProduct.stock < 5 ? 'text-red-500' : 'text-prussian'}`}>
                  {selectedProduct.stock} <span className="text-xs font-normal">{selectedProduct.unit}</span>
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-prussian">{t('sales.quantity')}</label>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => adjustQuantity(-1)} className="bg-alabaster text-prussian p-3 rounded-xl font-bold text-lg hover:bg-gray-200 transition-colors">
                  <Minus size={20} />
                </button>
                <input 
                  type="number" 
                  step="any"
                  className="flex-1 text-center text-xl font-bold bg-white border border-gray-200 rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-orange text-prussian"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
                <button type="button" onClick={() => adjustQuantity(1)} className="bg-alabaster text-prussian p-3 rounded-xl font-bold text-lg hover:bg-gray-200 transition-colors">
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1 text-prussian flex items-center gap-1">
                <User size={12} /> Customer (Due)
              </label>
              <select 
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-prussian focus:ring-2 focus:ring-orange"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              >
                <option value="">Cash Payment</option>
                {customers?.map(c => (
                  <option key={c.id} value={c.id}>{c.name} (Due: {formatCurrency(c.debt, lang)})</option>
                ))}
              </select>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-prussian/60">Subtotal</span>
                <span className="text-lg font-bold text-prussian">
                  {formatCurrency(selectedProduct.sellPrice * parseFloat(toEnglishDigits(quantity) || '0'), lang)}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-xs mb-4 px-1">
                <span className="text-prussian/40">Est. Profit</span>
                <span className="text-green-600 font-bold">
                  +{formatCurrency((selectedProduct.sellPrice - selectedProduct.buyPrice) * parseFloat(toEnglishDigits(quantity) || '0'), lang)}
                </span>
              </div>

              <Button 
                isLoading={isProcessing} 
                icon={<Check size={20} />}
                className="text-base py-4"
              >
                {customerId ? 'Record Due Sale' : 'Confirm Cash Sale'}
              </Button>
            </div>

          </form>
        )}
      </Modal>
    </div>
  );
};

export default Sales;
