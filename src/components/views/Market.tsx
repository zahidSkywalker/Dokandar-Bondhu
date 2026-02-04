import React, { useState } from 'react';
import { 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  Signal, // NEW: Icon for Cellular data
  Clock, 
  Package, 
  ChevronRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useMarketPrices } from '../../hooks/useMarketPrices';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency, toBanglaDigits } from '../../lib/utils';

const Market: React.FC = () => {
  const { t, lang } = useLanguage();
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState('all');

  // Destructure connectionType from hook
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

  // ... (Categories and formatLastUpdated functions remain the same) ...
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

  // Helper to determine icon based on connectionType
  const getConnectionIcon = () => {
    if (!onlineStatus) return <WifiOff size={12} />;
    if (connectionType === 'wifi') return <Wifi size={12} />;
    return <Signal size={12} />; // Defaults to Cellular signal for 4G/3G
  };

  const getConnectionText = () => {
    if (!onlineStatus) return t('common.offline');
    if (connectionType === 'wifi') return 'Wi-Fi';
    return 'Mobile Data'; // Specific text for cellular
  };

  return (
    <div className="pb-24 max-w-2xl mx-auto animate-fade-in">
      
      {/* Header Section */}
      <div className="mb-6 mt-2">
        <div className="flex justify-between items-start">
          <div>
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>
              {t('market.title')}
            </h1>
            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-earth-600'}`}>
              {t('market.subtitle')}
            </p>
          </div>
          
          {/* Sync & Status Button */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${
              onlineStatus 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {getConnectionIcon()} {/* CHANGED: Dynamic Icon */}
              {getConnectionText()} {/* CHANGED: Dynamic Text */}
            </div>
            
            <button 
              onClick={triggerSync}
              disabled={isSyncing || !onlineStatus}
              className={`p-2 rounded-xl shadow-md active:scale-95 transition-all ${
                !onlineStatus 
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400' 
                  : 'bg-earth-800 text-white dark:bg-earth-700'
              }`}
            >
              <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Status Messages */}
        <div className="mt-3 space-y-2">
          {syncStatus === 'success' && (
            <div className="flex items-center gap-2 text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg animate-slide-up">
              <CheckCircle size={14} /> {t('market.syncSuccess')}
            </div>
          )}
          {syncStatus === 'error' && (
            <div className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg animate-slide-up">
              <AlertCircle size={14} /> {t('market.syncError')}
            </div>
          )}
          {isSyncing && (
            <div className="flex items-center gap-2 text-xs font-bold text-earth-600 dark:text-earth-400 bg-earth-50 dark:bg-earth-900/20 p-2 rounded-lg">
              <RefreshCw size={14} className="animate-spin" /> {t('market.syncInProgress')}
            </div>
          )}
          
          {!isLoading && (
            <div className={`text-[10px] flex items-center gap-1 ${theme === 'dark' ? 'text-gray-500' : 'text-earth-400'}`}>
              <Clock size={10} /> {t('common.lastUpdated')}: {formatLastUpdated(lastUpdated)}
            </div>
          )}
        </div>
      </div>

      {/* Category Filter (Horizontal Scroll) */}
      <div className={`flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-2 ${theme === 'dark' ? 'scrollbar-thumb-gray-700' : 'scrollbar-thumb-earth-200'}`}>
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              activeCategory === cat.key
                ? theme === 'dark'
                  ? 'bg-earth-700 text-white border-earth-600 shadow-md'
                  : 'bg-earth-800 text-white border-earth-700 shadow-md'
                : theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                  : 'bg-white text-earth-600 border-cream-200 hover:bg-cream-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Content List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-20 rounded-2xl animate-pulse ${theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-cream-200'}`} />
          ))}
        </div>
      ) : prices.length === 0 ? (
        <div className={`p-10 rounded-2xl text-center border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
          <Package size={48} className={`mx-auto mb-4 opacity-20 ${theme === 'dark' ? 'text-gray-400' : 'text-earth-400'}`} />
          <p className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-earth-600'}`}>
            {t('market.emptyState')}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {prices.map((item) => (
            <div 
              key={item.id} 
              className={`p-4 rounded-2xl border shadow-sm flex justify-between items-center transition-all active:scale-[0.99] ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'
              }`}
            >
              <div className="flex-1">
                <h3 className={`font-bold text-base mb-1 ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>
                  {lang === 'bn' ? item.nameBn : item.nameEn}
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded bg-earth-50 dark:bg-earth-900/30 text-earth-600 dark:text-earth-400 font-bold uppercase`}>
                    {item.unit}
                  </span>
                  {item.category !== 'essentials' && (
                    <span className={`text-[10px] text-gray-500 dark:text-gray-400 capitalize`}>
                       {item.category}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>
                   {t('market.priceRange')}
                </div>
                <div className={`text-lg font-bold text-earth-700 dark:text-earth-300`}>
                  {formatCurrency(item.minPrice, lang)} - {formatCurrency(item.maxPrice, lang)}
                </div>
              </div>
              
              <ChevronRight className={`ml-2 ${theme === 'dark' ? 'text-gray-600' : 'text-earth-200'}`} size={16} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Market;
