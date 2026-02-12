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
import { useTheme } from '../../context/ThemeContext';

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { t, lang, toggleLang } = useLanguage();
  const { theme } = useTheme();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'inventory': return <Inventory />;
      case 'sales': return <Sales />;
      case 'expenses': return <Expenses />;
      case 'ledger': return <Ledger />;
      case 'suppliers': return <Suppliers />;
      case 'market': return <Market />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-[#F9FAFB] text-gray-800'}`}>
      
      {/* Header - Fixed Title to "Dokandar Bondhu" */}
      <header className={`sticky top-0 z-30 border-b px-6 py-4 flex justify-between items-center backdrop-blur-md ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700' : 'bg-white/80 border-gray-200 shadow-sm'}`}>
        <div>
          <h1 className={`font-bold text-xl tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {t('common.appName')}
          </h1>
          <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Business Manager</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab(prev => prev === 'settings' ? 'dashboard' : 'settings')}
            className={`p-2 rounded-xl ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
          >
            <SettingsIcon size={20} />
          </button>
          
          <button 
            onClick={toggleLang}
            className={`text-xs px-4 py-2 rounded-full font-bold border transition-colors ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-800'}`}
          >
            {lang === 'en' ? 'বাংলা' : 'English'}
          </button>
        </div>
      </header>

      {/* Main Content - FIXED PADDING: Added pb-28 to clear the floating navbar completely */}
      <main className="animate-fade-in px-6 pt-6 pb-28">
        {renderContent()}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default MainLayout;
