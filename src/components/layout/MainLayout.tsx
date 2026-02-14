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
import InstallBanner from '../ui/InstallBanner';
import { useLanguage } from '../../context/LanguageContext';
import { Settings as SettingsIcon } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { t, lang, toggleLang } = useLanguage();
  const { businessName } = useSettings();

  const renderContent = () => {
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
    <div className="app-container min-h-screen font-sans text-prussian flex flex-col">
      <header className="sticky top-0 z-30 px-5 py-4 flex justify-between items-center bg-prussian text-white shadow-md">
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-xl tracking-wider truncate">{t('common.appName')}</h1>
          <p className="text-[11px] font-medium text-white/70 truncate">{businessName}</p>
        </div>
        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
          <button 
            onClick={() => setActiveTab(prev => prev === 'settings' ? 'dashboard' : 'settings')} 
            className="p-2 rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Settings"
          >
            <SettingsIcon size={20} />
          </button>
          <button 
            onClick={toggleLang} 
            className="text-xs px-3 py-1.5 rounded-lg font-bold bg-orange text-prussian hover:bg-orange/80 transition-all active:scale-95"
          >
            {lang === 'en' ? 'বাংলা' : 'English'}
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 pt-6 pb-24 max-w-2xl mx-auto w-full overflow-x-hidden">
        {renderContent()}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    
     {/* ADD BANNER HERE - Renders above BottomNav (z-60) */}
      <InstallBanner />
    </div>
  );
};

export default MainLayout;
