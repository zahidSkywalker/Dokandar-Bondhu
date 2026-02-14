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

  // Filtered Products
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
    if (isNaN(qty) || qty <= 0) return alert("Invalid quantity");

    if (qty > selectedProduct.stock) {
      return alert(`Insufficient stock. Available: ${selectedProduct.stock} ${selectedProduct.unit}`);
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
    const current = parseFloat(quantity) || 0;
    const newQty = Math.max(0.1, current + amount);
    setQuantity(String(newQty));
  };

  return (
    <div className="pb-32 animate-fade-in">
      <FlowAnimation trigger={showFlowAnimation} color="#FCA311" />

      {/* --- Header Section --- */}
      <div className="mb-6">
        {/* 1. H1 Typography */}
        <h1 className="text-h1 text-prussian font-display mb-6">{t('sales.title')}</h1>
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-prussian/40 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search products..."
            className="w-full bg-white border border-gray-border rounded-md pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange focus:border-orange transition-all text-body text-prussian shadow-card"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- Product Grid Section (Req 8) --- */}
      <div className="mb-8">
        <h2 className="text-small font-semibold text-secondary uppercase tracking-wide mb-3 px-1">In Stock</h2>
        <div className="grid grid-cols-3 gap-3">
          {!filteredProducts ? (
             <div className="col-span-3 text-center py-10 text-secondary">Loading...</div>
          ) : filteredProducts.length === 0 ? (
             <div className="col-span-3 flex flex-col items-center justify-center py-10 text-center bg-white rounded-xl border border-gray-border border-dashed">
               <Package size={40} className="text-prussian/20 mb-2" />
               <p className="text-sm font-medium text-secondary">No products found</p>
             </div>
          ) : (
            filteredProducts.map((product, i) => (
              <button
                key={product.id}
                onClick={() => openSaleModal(product)}
                // 5. Breathing space (p-3), 7. Motion (tap-scale), 4. Elevation (shadow-card)
                className="bg-white p-3 rounded-md shadow-card flex flex-col items-center justify-between text-left transition-all hover:shadow-float active:scale-[0.98] h-36 stagger-item border border-transparent hover:border-orange/30"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="w-full flex justify-between items-start mb-1">
                   <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                     product.stock < 5 
                       ? 'bg-red-50 text-red-500' 
                       : 'bg-green-50 text-green-600'
                   }`}>
                     {product.stock} {product.unit}
                   </span>
                 </div>
                
                <div className="flex-1 flex items-center justify-center w-full">
                  <h3 className="text-sm font-bold text-prussian text-center leading-tight line-clamp-2">
                    {product.name}
                  </h3>
                </div>
                
                <div className="w-full mt-1 flex justify-between items-center">
                   <span className="text-[9px] text-secondary font-medium truncate pr-1">{product.category}</span>
                   <span className="text-sm font-bold text-orange">{formatCurrency(product.sellPrice, lang)}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* --- Recent Sales Section --- */}
      {recentSales && recentSales.length > 0 && (
        <div className="mt-6">
          <h2 className="text-small font-semibold text-secondary uppercase tracking-wide mb-3 px-1">Recent Transactions</h2>
          <div className="space-y-2">
             {recentSales.map(sale => (
               <Card key={sale.id} className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-alabaster rounded-sm text-prussian"><ShoppingCart size={14}/></div>
                   <div>
                     <p className="text-sm font-semibold text-prussian">{sale.productName}</p>
                     <p className="text-small text-secondary">
                       {sale.quantity} {sale.unit || 'pcs'}
                     </p>
                   </div>
                 </div>
                 <p className="text-body-lg font-bold text-prussian">{formatCurrency(sale.total, lang)}</p>
               </Card>
             ))}
          </div>
        </div>
      )}

      {/* --- SALE BOTTOM SHEET --- */}
      <BottomSheet 
        isOpen={!!selectedProduct} 
        onClose={closeModal} 
        title={selectedProduct?.name || 'New Sale'}
        // 3. Sticky Footer Implementation
        footer={
          selectedProduct && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-small px-1">
                 <span className="text-secondary flex items-center gap-1"><TrendingUp size={12}/> Est. Profit</span>
                 <span className="text-green-600 font-bold">
                   +{formatCurrency((selectedProduct.sellPrice - selectedProduct.buyPrice) * parseFloat(toEnglishDigits(quantity) || '0'), lang)}
                 </span>
              </div>
              {/* 10. Primary CTA */}
              <Button 
                onClick={handleSale}
                isLoading={isProcessing} 
                icon={<Check size={20} />}
              >
                {customerId ? 'Record Due Sale' : 'Confirm Cash Sale'}
              </Button>
            </div>
          )
        }
      >
        {selectedProduct && (
          <div className="space-y-6">
            {/* Product Info Header */}
            <div className="flex justify-between items-center bg-alabaster p-4 rounded-md">
              <div>
                <p className="text-small text-secondary mb-1">Price per {selectedProduct.unit}</p>
                {/* 1. H1 Typography */}
                <p className="text-h1 text-prussian font-display">{formatCurrency(selectedProduct.sellPrice, lang)}</p>
              </div>
              <div className="text-right">
                <p className="text-small text-secondary mb-1">In Stock</p>
                <p className={`text-h2 ${selectedProduct.stock < 5 ? 'text-red-500' : 'text-prussian'}`}>
                  {selectedProduct.stock}
                </p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-small font-semibold mb-2 text-prussian">{t('sales.quantity')}</label>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => adjustQuantity(-1)} className="bg-alabaster text-prussian p-3 rounded-md font-bold text-lg hover:bg-gray-200 transition-colors active:scale-95">
                  <Minus size={20} />
                </button>
                <input 
                  type="number" 
                  step="any"
                  className="flex-1 text-center text-h1 font-bold bg-white border border-gray-border rounded-md py-2 focus:outline-none focus:ring-2 focus:ring-orange text-prussian"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
                <button type="button" onClick={() => adjustQuantity(1)} className="bg-alabaster text-prussian p-3 rounded-md font-bold text-lg hover:bg-gray-200 transition-colors active:scale-95">
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Customer Selection */}
            <div>
              <label className="block text-small font-semibold mb-2 text-prussian flex items-center gap-1">
                <User size={12} /> Customer (Due)
              </label>
              <select 
                className="w-full px-4 py-3 rounded-md bg-white border border-gray-border text-prussian focus:ring-2 focus:ring-orange text-body"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              >
                <option value="">Cash Payment</option>
                {customers?.map(c => (
                  <option key={c.id} value={c.id}>{c.name} (Due: {formatCurrency(c.debt, lang)})</option>
                ))}
              </select>
            </div>
            
            {/* Subtotal Display */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-border">
              <span className="text-body text-secondary">Subtotal</span>
              <span className="text-h2 font-bold text-prussian">
                {formatCurrency(selectedProduct.sellPrice * parseFloat(toEnglishDigits(quantity) || '0'), lang)}
              </span>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
};

export default Sales;
