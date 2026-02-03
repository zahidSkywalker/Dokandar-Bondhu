import React, { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, Package, Clock, Activity } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { useMarketPrices } from '../../hooks/useMarketPrices'; // Import the hook
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency, formatDate } from '../../lib/utils';

const MarketPrices: React.FC = () => {
  const { t, lang } = useLanguage();
  const { theme } = useTheme();
  const { prices, isLoading, lastUpdate, refreshPrices, isOnline } = useMarketPrices();
  const [filter, setFilter] = useState<string>('All');

  return (
    <div className={`pb-24 max-w-2xl mx-auto min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-cream-50 text-earth-900'}`}>
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 mt-2">
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>Market Prices</h1>
        <button 
          onClick={() => refreshPrices()}
          disabled={isLoading}
          className={`p-3 rounded-2xl shadow-xl active:scale-95 transition-transform ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-earth-800 text-white'}`}
        >
          <RefreshCw className={`${isLoading ? 'animate-spin' : ""} size={20} />
        </button>
      </div>

      {/* Live Status Badge */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'} }`}></div>
        <span className={`text-xs font-bold uppercase ${isOnline ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
          {isOnline ? 'Live Updates' : 'Offline Mode'}
        </span>
        <span className="text-[10px] text-gray-400 dark:text-gray-500">
          {lastUpdate ? `Updated: ${formatDate(new Date(lastUpdate.date), 'en')}` : 'No updates yet'}
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {['All', 'Rice', 'Vegetable', 'Oil', 'Spice'].map((category) => (
          <button 
            key={category}
            onClick={() => setFilter(category)}
            className={`pb-3 px-4 rounded-xl border-b-2 whitespace-nowrap transition-colors ${filter === category 
              ? (theme === 'dark' ? 'bg-gray-800 border-earth-600 text-white' : 'bg-earth-800 text-white shadow-md') 
              : (theme === 'dark' ? 'bg-transparent text-gray-600 border-transparent' : 'bg-transparent text-earth-600')
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && !prices.length ? (
        <div className="flex justify-center items-center p-10">
          <div className="w-8 h-8 border-4 border-earth-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 dark:text-gray-400 mt-4">Loading market data...</p>
        </div>
      ) : !isLoading && prices.length === 0 ? (
        <div className="p-10 text-center text-gray-400 dark:text-gray-500">
          <Package size={32} className="mx-auto mb-2 opacity-20" />
          <p className="font-medium">No market data available.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Today's Market Highlight */}
          <div className={`p-5 rounded-2xl border shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Clock className="text-earth-600 dark:text-gray-300" size={16} />
                  <div>
                    <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>Today's Market</h3>
                    <p className={`text-xs text-gray-400 dark:text-gray-500`}>Daily Retail Market Monitoring</p>
                  </div>
                </div>
                <div className="text-right">
                  <Activity size={16} className="text-earth-500 dark:text-gray-400" />
                </div>
            </div>
          </div>
        </div>

        {/* Price List Carousel */}
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory scroll-smooth">
          {prices.map((item) => (
            <div key={item.id} className={`snap-center flex-shrink-0 w-[85%]`}>
              <div className={`p-4 rounded-2xl border shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'} h-full flex flex-col justify-between`}>
                <div className="flex-1">
                   <div>
                     <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-bold uppercase text-earth-500 dark:text-gray-400`}>{item.category}</span>
                        <h3 className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>{item.name}</h3>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-earth-500'}`}>{formatDate(new Date(item.date), 'en')}</p>
                   </div>
                   </div>
                   
                   <div className="flex items-end gap-2">
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${theme === 'top-20' ? 'text-teal-600' : 'text-teal-700'}`}>{formatCurrency(item.minPrice, lang)}</p>
                        <p className="text-[10px] font-bold text-gray-400">Min</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold text-green-600 dark:text-green-400`}`}>{formatCurrency(item.maxPrice, lang)}</p>
                        <p className="text-[10px] font-bold text-gray-400">Max</p>
                      </div>
                   </div>
                   </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketPrices;
