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
    switch (activeTab) {
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
    <div className={`min-h-screen font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Header */}
      <header className={`
        sticky top-0 z-30 border-b px-4 py-3.5 flex justify-between items-center backdrop-blur-md transition-colors duration-300
        ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white/80 border-slate-200 text-slate-800'}
      `}>
        <div>
          <h1 className="font-bold text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-6 bg-primary-600 rounded-full"></span>
            {t('common.appName')}
          </h1>
          <p className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} ml-4`}>Business Manager</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveTab(prev => prev === 'settings' ? 'dashboard' : 'settings')}
            className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
          >
            <SettingsIcon size={20} />
          </button>
          
          <button 
            onClick={toggleLang}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-all duration-200 ${
              theme === 'dark' 
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' 
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {lang === 'en' ? 'বাংলা' : 'English'}
          </button>
          
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-all duration-200 ${
              theme === 'dark' 
                ? 'bg-slate-800 text-amber-400 hover:bg-slate-700' 
                : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
            }`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* FIX: Added pb-safe to prevent Navbar Cutoff on devices with notches/home bars */}
      <main className="animate-fade-in px-4 pt-4 max-w-2xl mx-auto pb-safe">
        {renderContent()}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default MainLayout;
