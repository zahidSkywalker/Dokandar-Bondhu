import React, { useState } from 'react';
import BottomNav from './BottomNav';
import Dashboard from '../views/Dashboard';
import Inventory from '../views/Inventory';
import Sales from '../views/Sales';
import Expenses from '../views/Expenses';
import { useLanguage } from '../../context/LanguageContext';

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { t, lang, toggleLang } = useLanguage(); // Added toggleLang

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'inventory': return <Inventory />;
      case 'sales': return <Sales />;
      case 'expenses': return <Expenses />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 font-sans text-earth-900 pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-cream-200 px-4 py-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="font-bold text-xl tracking-tight text-earth-800">{t('common.appName')}</h1>
          <p className="text-xs text-earth-600 font-medium">Business Manager</p>
        </div>
        <button 
          onClick={toggleLang} // FIXED: Added Click Handler
          className="flex items-center gap-1 bg-earth-50 hover:bg-earth-100 text-earth-800 text-xs px-3 py-1.5 rounded-full transition-colors border border-earth-100 font-semibold"
        >
          <span>{lang === 'en' ? 'বাংলা' : 'English'}</span>
        </button>
      </header>

      <main className="animate-fade-in px-4 pt-4">
        {renderContent()}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default MainLayout;
