import React, { useState } from 'react';
import BottomNav from './BottomNav';
import Dashboard from '../views/Dashboard';
import Inventory from '../views/Inventory';
import Sales from '../views/Sales';
import Expenses from '../views/Expenses';
import Ledger from '../views/Ledger';
import MarketPrices from '../views/MarketPrices'; // Import the new component
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { t, lang } = useLanguage();
  const { theme } = useTheme();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'inventory': return <Inventory />;
      case 'sales': return <Sales />;
      case 'expenses': return <Expenses />;
      case 'ledger': return <Ledger />;
      case 'market': return <MarketPrices />; // NEW: Render Market Prices
      default: return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen font-sans pb-20 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-cream-50 text-earth-900'}`}>
      
      <header className={`sticky top-0 z-30 border-b px-4 py-4 flex justify-between items-center ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700 backdrop-blur-md' : 'bg-white/80 border-cream-200 backdrop-blur-md shadow-sm'}`}>
        <div>
          <h1 className={`font-bold text-xl tracking-tight ${theme === 'dark' ? 'text-white' : 'text-earth-800'}`}>{t('common.appName')}</h1>
          <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-earth-600'}`}>Business Manager</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveTab(prev => prev === 'settings' ? 'dashboard' : 'settings')}
            className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-earth-50 text-earth-600'}`}
          >
            {/* Using a Settings Icon as a placeholder for future Settings feature, or you can remove this button */}
            <div className="w-6 h-6 border-2 border-earth-600 border-t-transparent rounded-full"></div> 
          </button>
          <button 
            onClick={() => setActiveLang(prev => prev === 'en' ? 'bn' : 'en')}
            className={`text-xs px-3 py-1.5 rounded-full font-bold border transition-colors ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-earth-50 border-cream-200 text-earth-800'}`}
          >
            {lang === 'en' ? 'বাংলা' : 'English'}
          </button>
          <button 
            onClick={() => window.location.reload()}
            className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-earth-50 text-earth-600'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-5 h-5 text-earth-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v1" stroke="currentColor" />
            </svg>
          </button>
        </div>
      </header>

      <main className="animate-fade-in px-4 pt-4">
        {renderContent()}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default MainLayout;
