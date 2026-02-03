import React, { useState } from 'react';
import {
  RefreshCw,
  Package,
  Clock,
  Activity,
} from 'lucide-react';

import { useMarketPrices } from '../../hooks/useMarketPrices';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency, formatDate } from '../../lib/utils';

type Category = 'All' | 'Rice' | 'Vegetable' | 'Oil' | 'Spice';

const CATEGORIES: Category[] = ['All', 'Rice', 'Vegetable', 'Oil', 'Spice'];

const MarketPrices: React.FC = () => {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const {
    prices,
    isLoading,
    lastUpdate,
    refreshPrices,
    isOnline,
  } = useMarketPrices();

  const [filter, setFilter] = useState<Category>('All');

  const filteredPrices =
    filter === 'All'
      ? prices
      : prices.filter(item => item.category === filter);

  return (
    <div
      className={`pb-24 min-h-screen max-w-2xl mx-auto ${
        theme === 'dark'
          ? 'bg-gray-900 text-gray-100'
          : 'bg-cream-50 text-earth-900'
      }`}
    >
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center px-4 mt-4 mb-6">
        <h1 className="text-2xl font-bold">Market Prices</h1>

        <button
          onClick={refreshPrices}
          disabled={isLoading}
          className={`p-3 rounded-2xl shadow-lg active:scale-95 transition ${
            theme === 'dark'
              ? 'bg-gray-700 text-white'
              : 'bg-earth-800 text-white'
          }`}
        >
          <RefreshCw
            size={20}
            className={isLoading ? 'animate-spin' : ''}
          />
        </button>
      </div>

      {/* ================= LIVE STATUS ================= */}
      <div className="flex items-center gap-2 px-4 mb-4">
        <span
          className={`w-2 h-2 rounded-full ${
            isOnline
              ? 'bg-green-500 animate-pulse'
              : 'bg-gray-400'
          }`}
        />

        <span
          className={`text-xs font-bold uppercase ${
            isOnline
              ? 'text-green-600 dark:text-green-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {isOnline ? 'Live Updates' : 'Offline Mode'}
        </span>

        <span className="text-[10px] text-gray-400 dark:text-gray-500">
          {lastUpdate
            ? `Updated: ${formatDate(
                new Date(lastUpdate.date),
                'en'
              )}`
            : 'No updates yet'}
        </span>
      </div>

      {/* ================= FILTER TABS ================= */}
      <div className="flex gap-2 px-4 mb-6 overflow-x-auto no-scrollbar">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition ${
              filter === category
                ? theme === 'dark'
                  ? 'bg-gray-800 text-white'
                  : 'bg-earth-800 text-white shadow'
                : theme === 'dark'
                ? 'text-gray-400'
                : 'text-earth-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* ================= CONTENT ================= */}
      {isLoading && prices.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-earth-600 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-sm text-gray-500">
            Loading market data…
          </p>
        </div>
      )}

      {!isLoading && prices.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Package size={36} className="mx-auto mb-3 opacity-20" />
          <p className="font-medium">No market data available</p>
        </div>
      )}

      {filteredPrices.length > 0 && (
        <>
          {/* ===== TODAY CARD ===== */}
          <div
            className={`mx-4 mb-6 p-5 rounded-2xl border ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-cream-200'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <div>
                  <h3 className="font-bold text-lg">
                    Today’s Market
                  </h3>
                  <p className="text-xs text-gray-400">
                    Daily Retail Market Monitoring
                  </p>
                </div>
              </div>

              <Activity
                size={16}
                className="text-earth-500 dark:text-gray-400"
              />
            </div>
          </div>

          {/* ===== PRICE CARDS ===== */}
          <div className="flex gap-4 px-4 overflow-x-auto snap-x snap-mandatory no-scrollbar">
            {filteredPrices.map(item => (
              <div
                key={item.id}
                className="snap-center flex-shrink-0 w-[85%]"
              >
                <div
                  className={`p-4 rounded-2xl border h-full ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-white border-cream-200'
                  }`}
                >
                  <span className="text-xs font-bold uppercase text-earth-500 dark:text-gray-400">
                    {item.category}
                  </span>

                  <h3 className="text-xl font-bold mt-1 mb-1">
                    {item.name}
                  </h3>

                  <p className="text-xs text-gray-400 mb-4">
                    {formatDate(new Date(item.date), 'en')}
                  </p>

                  <div className="flex gap-6">
                    <div>
                      <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                        {formatCurrency(item.minPrice, lang)}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400">
                        Min
                      </p>
                    </div>

                    <div>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(item.maxPrice, lang)}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400">
                        Max
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MarketPrices;
