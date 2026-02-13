import React, { useState } from 'react';
import { RefreshCw, Wifi, WifiOff, Clock, Package, CheckCircle, AlertCircle } from 'lucide-react';
import { useMarketPrices } from '../../hooks/useMarketPrices';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency } from '../../lib/utils';

const Market: React.FC = () => {
  const { t, lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');

  const {
    prices, isLoading, isSyncing, lastUpdated, syncStatus, triggerSync, onlineStatus
  } = useMarketPrices(activeCategory);

  const categories = [
    { key: 'all', label: t('market.categories.all') },
    { key: 'rice', label: t('market.categories.rice') },
    { key: 'vegetables', label: t('market.categories.vegetables') },
    { key: 'spices', label: t('market.categories.spices') },
    { key: 'meat', label: t('market.categories.meat') },
    { key: 'fruits', label: t('market.categories.fruits') },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-prussian font-display">{t('market.title')}</h1>
        
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${
            onlineStatus ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {onlineStatus ? <Wifi size={12} /> : <WifiOff size={12} />}
            {onlineStatus ? 'Online' : 'Offline'}
          </div>
          
          <button onClick={triggerSync} disabled={isSyncing || !onlineStatus} className="bg-orange p-2 rounded-xl shadow-md text-prussian disabled:opacity-50">
            <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
      
      {syncStatus === 'success' && (
        <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 p-2 rounded-lg border border-green-100">
          <CheckCircle size={14} /> {t('market.syncSuccess')}
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-gray-100 mb-4">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              activeCategory === cat.key
                ? 'bg-prussian text-white border-prussian shadow-md'
                : 'bg-white text-prussian border-gray-200 hover:border-orange'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {isLoading || prices.length === 0 ? (
         <div className="flex flex-col items-center justify-center py-16 text-center">
             <Package size={48} className="text-prussian/20 mb-4" />
             <p className="text-prussian/50 font-medium">
                {isLoading ? 'Loading data...' : 'No data found. Tap sync to load prices.'}
             </p>
         </div>
      ) : (
        <div className="space-y-3">
          {prices.map((item, i) => (
            <div 
              key={item.id || i} 
              className="p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center bg-white stagger-item"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div className="flex-1">
                <h3 className="font-bold text-prussian">{lang === 'bn' ? item.nameBn : item.nameEn}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-alabaster text-prussian/60 font-bold uppercase mt-1 inline-block">
                  {item.unit}
                </span>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-prussian/50 uppercase">Price Range</div>
                <div className="text-lg font-bold text-orange">
                  {formatCurrency(item.minPrice, lang)} - {formatCurrency(item.maxPrice, lang)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Market;
