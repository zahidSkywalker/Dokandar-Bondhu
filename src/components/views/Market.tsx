import React, { useState } from 'react';
import { 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  Signal, 
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

  const getConnectionIcon = () => {
    if (!onlineStatus) return <WifiOff size={12} />;
    if (connectionType === 'wifi') return <Wifi size={12} />;
    return <Signal size={12} />;
  };

  const getConnectionText = () => {
    if (!onlineStatus) return t('common.offline');
    if (connectionType === 'wifi') return 'Wi-Fi';
    return 'Mobile Data';
  };

  return (
    <div className="pb-24 max-w-2xl mx-auto animate-fade-in">
      
      {/* Header Section */}
      <div className="mb-6 mt-2">
        <div className="flex justify-between items-start">
          <div>
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {t('market.title')}
            </h1>
            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {t('market.subtitle')}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border ${
              onlineStatus 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30' 
                : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
            }`}>
              {getConnectionIcon()}
              {getConnectionText()}
            </div>
            
            <button 
              onClick={triggerSync}
              disabled={isSyncing || !onlineStatus}
              className={`p-2 rounded-xl shadow-md active:scale-95 transition-all ${
                !onlineStatus 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' 
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Status Messages */}
        <div className="mt-4 space-y-2">
          {syncStatus === 'success' && (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg animate-slide-up border border-emerald-100 dark:border-emerald-900/30">
              <CheckCircle size={14} /> {t('market.syncSuccess')}
            </div>
          )}
          {syncStatus === 'error' && (
            <div className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg animate-slide-up border border-red-100 dark:border-red-900/30">
              <AlertCircle size={14} /> {t('market.syncError')}
            </div>
          )}
          {isSyncing && (
            <div className="flex items-center gap-2 text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 p-3 rounded-lg">
              <RefreshCw size={14} className="animate-spin" /> {t('market.syncInProgress')}
            </div>
          )}
          
          {!isLoading && (
            <div className={`text-[10px] flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
              <Clock size={10} /> {t('common.lastUpdated')}: {formatLastUpdated(lastUpdated)}
            </div>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className={`flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-2 ${theme === 'dark' ? 'scrollbar-thumb-slate-700' : 'scrollbar-thumb-slate-300'}`}>
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`
              whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all border shrink-0
              ${activeCategory === cat.key
                ? theme === 'dark'
                  ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-500/20'
                  : 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-500/20'
                : theme === 'dark'
                  ? 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }
            `}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Content List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-20 rounded-xl animate-pulse ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`} />
          ))}
        </div>
      ) : prices.length === 0 ? (
        <div className={`
          p-10 rounded-2xl text-center border
          ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}
        `}>
          <Package size={48} className={`mx-auto mb-4 opacity-20 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
          <p className={`font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
            {t('market.emptyState')}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {prices.map((item, index) => (
            <div 
              key={item.id} 
              className={`
                p-4 rounded-xl border shadow-sm flex justify-between items-center transition-all active:scale-[0.99] opacity-0 animate-slide-up-fade
                ${theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-100 hover:border-slate-200'}
              `}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-base mb-1 truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {lang === 'bn' ? item.nameBn : item.nameEn}
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wide ${
                    theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {item.unit}
                  </span>
                  {item.category !== 'essentials' && (
                    <span className={`text-[10px] text-slate-400 capitalize`}>
                       {item.category}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right ml-4">
                <div className={`text-xs font-semibold mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                   {t('market.priceRange')}
                </div>
                <div className={`text-base font-bold font-mono text-primary-600 dark:text-primary-400`}>
                  {formatCurrency(item.minPrice, lang)} - {formatCurrency(item.maxPrice, lang)}
                </div>
              </div>
              
              <ChevronRight className={`ml-3 shrink-0 ${theme === 'dark' ? 'text-slate-600' : 'text-slate-300'}`} size={16} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Market;
