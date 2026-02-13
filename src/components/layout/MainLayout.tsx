import React, { useState } from 'react';
import BottomNav from './BottomNav';
import Dashboard from '../views/Dashboard';
import Inventory from '../views/Inventory';
import Sales from '../views/Sales';
import Expenses from '../views/Expenses';
import Ledger from '../views/Ledger';
import Settings from '../views/Settings';
import Suppliers from '../views/Suppliers'; 
import Market from '../views/Market';
import { useLanguage } from '../../context/LanguageContext';
import { Settings as SettingsIcon } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { t, lang, toggleLang } = useLanguage();
  const { businessName } = useSettings();

  const renderContent = () => {
    // Adding a key forces React to remount the component, re-triggering animations
    const key = activeTab;
    switch (activeTab) {
      case 'dashboard': return <Dashboard key={key} />;
      case 'inventory': return <Inventory key={key} />;
      case 'sales': return <Sales key={key} />;
      case 'expenses': return <Expenses key={key} />;
      case 'ledger': return <Ledger key={key} />;
      case 'suppliers': return <Suppliers key={key} />;
      case 'market': return <Market key={key} />;
      case 'settings': return <Settings key={key} />;
      default: return <Dashboard key={key} />;
    }
  };

  return (
    <div className="min-h-screen font-sans bg-alabaster text-prussian">
      
      {/* Header - Prussian Blue Background */}
      <header className="sticky top-0 z-40 px-6 py-4 flex justify-between items-center bg-prussian text-white shadow-lg">
        <div className="animate-fade-in">
          <h1 className="font-display text-2xl tracking-wider">
            {t('common.appName')}
          </h1>
          <p className="text-xs font-medium text-alabaster opacity-80">{businessName}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab(prev => prev === 'settings' ? 'dashboard' : 'settings')}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <SettingsIcon size={20} />
          </button>
          
          <button 
            onClick={toggleLang}
            className="text-xs px-4 py-2 rounded-full font-bold bg-orange text-prussian hover:bg-orange/80 transition-all hover:scale-105 active:scale-95"
          >
            {lang === 'en' ? 'বাংলা' : 'English'}
          </button>
        </div>
      </header>

      {/* Main Content - Added pb-28 to clear fixed navbar */}
      <main className="px-4 pt-6 pb-28 max-w-2xl mx-auto">
        {renderContent()}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default MainLayout;
