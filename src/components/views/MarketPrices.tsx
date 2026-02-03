import React, { useEffect } from 'react';
import { useMarketPrices } from '../../hooks/useMarketPrices';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency, toBanglaDigits } from '../../lib/utils';
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';

const MarketPrices: React.FC = () => {
  const { t, lang } = useLanguage();
  const { theme } = useTheme();
  const { prices, isLoading, lastUpdate, refreshPrices, isOnline } = useMarketPrices();

  // Sort prices (Rice first for importance)
  const sortedPrices = [...prices].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className={`pb-24 max-w-2xl mx-auto min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-cream-50 text-earth-900'}`}>
      
      <div className="flex justify-between items-center mb-6 mt-2">
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>{t('common.search')}</h1>
        <button 
          onClick={() => refreshPrices()}
          disabled={isLoading}
          className={`p-3 rounded-2xl shadow-xl active:scale-95 transition-transform ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-earth-800 text-white'}`}
        >
          <RefreshCw className={`${isLoading ? 'animate-spin' : ""} size={24} />
        </button>
      </div>

      {/* Live Status */}
      <div className="flex items-center justify-between mb-6">
         <div className={`flex items-center gap-2 ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
           <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
           <span className="text-xs font-bold uppercase">
             {isOnline ? 'Live Updates' : 'Offline Mode'}
           </span>
         </div>
         <span className="text-xs text-gray-400">
            {lastUpdate ? `Updated: ${lastUpdate}` : 'No data yet'}
         </span>
      </div>

      {/* Prices List */}
      <div className="space-y-4">
        {sortedPrices.map((item) => (
          <div key={item.name} className={`p-5 rounded-2xl border shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
            <div className="flex justify-between items-start mb-3">
               <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-cream-50 text-earth-600'}`}>
                    <span className="text-xs font-bold uppercase text-earth-500 dark:text-gray-400">Category</span>
                  </div>
                  <div>
                    <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>{item.name}</h3>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-earth-500'}`}>{item.unit}</p>
                  </div>
               </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
                <div className="text-right">
                  <p className={`text-xs text-gray-400 ${theme === 'dark' ? 'text-gray-500' : 'text-earth-400'}`}>
                    {lang === 'bn' ? toBanglaDigits(item.date.split('T')[0]) : item.date.split('T')[0]}
                  </p>
                  <p className="text-xs font-bold text-gray-300 dark:text-gray-600">
                    {lang === 'bn' ? 'Last Updated' : 'Updated Today'}
                  </p>
                </div>
                 <div className="text-right">
                    <TrendingUp size={18} className="text-green-500" />
                 </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-2">
             <div>
                <p className={`text-xs font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-earth-500'} mb-1`}>Min Price</p>
                <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>{formatCurrency(item.minPrice, lang)}</p>
             </div>
             <div>
                <p className={`text-xs font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-earth-500'} mb-1`}>Max Price</p>
                <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>{formatCurrency(item.maxPrice, lang)}</p>
             </div>
          </div>
          </div>

          {/* Trend */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
             <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-earth-500'}`}>
                  {item.minPrice !== item.maxPrice ? <TrendingDown className="text-red-500" /> : ''}
                </span>
             </div>
          </div>
        </div>
        ))}
      </div>

      {/* Empty State */}
      {prices.length === 0 && !isLoading && (
        <div className="p-10 text-center text-gray-400">
            <p>No market data loaded. Check connection.</p>
        </div>
      )}
    </div>
  );
};

export default MarketPrices;
