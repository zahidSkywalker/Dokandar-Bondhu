import React, { useState } from 'react';
import BottomNav from './BottomNav';
import Dashboard from '../views/Dashboard';
import Inventory from '../views/Inventory';
import Sales from '../views/Sales';
import Expenses from '../views/Expenses';
import Ledger from '../views/Ledger';
import Settings from '../views/Settings';
import { useLanguage } from '../../context/LanguageContext';
import { Settings as SettingsIcon, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { t, lang, toggleLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'inventory': return <Inventory />;
      case 'sales': return <Sales />;
      case 'expenses': return <Expenses />;
      case 'ledger': return <Ledger />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    // ...
      <header className={`sticky top-0 z-30 border-b px-4 py-4 flex justify-between items-center ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700 backdrop-blur-md' : 'bg-white/80 border-cream-200 backdrop-blur-md shadow-sm'}`}>
        <div>
          <h1 className={`font-bold text-xl tracking-tight ${theme === 'dark' ? 'text-white' : 'text-earth-800'}`}>{t('common.appName')}</h1>
          <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-earth-600'}`}>Business Manager</p>
        </div>
        <div className="flex items-center gap-2">
          {/* UPDATED BUTTON LOGIC BELOW */}
          <button 
            onClick={() => setActiveTab(prev => prev === 'settings' ? 'dashboard' : 'settings')}
            className={`p-2 rounded-xl ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-earth-50 text-earth-600'}`}
          >
            <SettingsIcon size={20} />
          </button>
          <button 
            onClick={toggleLang}
            className={`text-xs px-3 py-1.5 rounded-full font-bold border transition-colors ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-earth-50 border-earth-100 text-earth-800'}`}
          >
            {lang === 'en' ? 'বাংলা' : 'English'}
          </button>
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-gray-700 text-yellow-400' : 'bg-earth-50 text-earth-600'}`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
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
