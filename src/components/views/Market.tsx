import React, { useState, useEffect } from 'react';
import { RefreshCw, Wifi, WifiOff, Signal, Clock, Package, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useMarketPrices } from '../../hooks/useMarketPrices';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency } from '../../lib/utils';

const Market: React.FC = () => {
  const { t, lang } = useLanguage();
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState('all');

  const {
    prices,
    isLoading,
    isSyncing,
    lastUpdated,
    syncStatus,
    triggerSync,
    onlineStatus,
    connectionType 
  } = useMarketPrices(activeCategory);

  const categories = [
    { key: 'all', label: t('market.categories.all') },
    { key: 'rice', label: t('market.categories.rice') },
    { key: 'vegetables', label: t('market.categories.vegetables') },
    { key: 'spices', label: t('market.categories.spices') },
    { key: 'meat', label: t('market.categories.meat') },
    { key: 'fruits', label: t('market.categories.fruits') },
    { key: 'essentials', label: t('market.categories.essentials') },
  ];

  const formatLastUpdated = (date?: Date) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat(lang === 'bn' ? 'bn-BD' : 'en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="pb-24 max-w-2xl mx-auto animate-fade-in">
      
      <div className="mb-6 mt-2">
        <div className="flex justify-between items-start">
          <div>
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t('market.title')}
            </h1>
            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('market.subtitle')}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${
              onlineStatus 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {onlineStatus ? <Wifi size={12} /> : <WifiOff size={12} />}
              {onlineStatus ? 'Online' : 'Offline'}
            </div>
            
            <button 
              onClick={triggerSync}
              disabled={isSyncing || !onlineStatus}
              className={`p-2 rounded-xl shadow-md active:scale-95 transition-all ${
                !onlineStatus 
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400' 
                  : 'bg-primary text-white'
              }`}
            >
              <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {syncStatus === 'success' && (
            <div className="flex items-center gap-2 text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
              <CheckCircle size={14} /> {t('market.syncSuccess')}
            </div>
          )}
          {syncStatus === 'error' && (
            <div className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
              <AlertCircle size={14} /> {t('market.syncError')}
            </div>
          )}
          
          {!isLoading && lastUpdated && (
            <div className={`text-[10px] flex items-center gap-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              <Clock size={10} /> Last Updated: {formatLastUpdated(lastUpdated)}
            </div>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              activeCategory === cat.key
                ? 'bg-primary text-white border-primary shadow-md'
                : theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Content List */}
      {isLoading || prices.length === 0 ? (
         <div className="flex flex-col items-center justify-center py-16 text-center">
             <Package size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
             <p className="text-gray-500 dark:text-gray-400 font-medium">
                {isLoading ? 'Loading data...' : 'No data found. Tap sync to load prices.'}
             </p>
         </div>
      ) : (
        <div className="space-y-3">
          {prices.map((item, index) => (
            <div 
              key={item.id || index} 
              className={`p-4 rounded-2xl border shadow-sm flex justify-between items-center transition-all active:scale-[0.99] ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex-1">
                <h3 className={`font-bold text-base mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {lang === 'bn' ? item.nameBn : item.nameEn}
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold uppercase`}>
                    {item.unit}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className={`text-xs font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                   {t('market.priceRange')}
                </div>
                <div className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
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
