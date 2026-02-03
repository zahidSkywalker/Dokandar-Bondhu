import React, { useState } from 'react';
import BottomNav from './BottomNav';
import Dashboard from '../views/Dashboard';
import Inventory from '../views/Inventory';
import Sales from '../views/Sales';
import Expenses from '../views/Expenses';
import { useLanguage } from '../../context/LanguageContext';

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { t, lang } = useLanguage();

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
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Top Bar */}
      <header className="bg-white sticky top-0 z-30 border-b border-gray-100 px-4 py-3 flex justify-between items-center shadow-sm">
        <h1 className="font-bold text-lg text-teal-700 tracking-tight">{t('common.appName')}</h1>
        <button 
          onClick={() => {}} // Placeholder for sync or settings
          className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600 font-medium"
        >
          {lang === 'en' ? 'বাংলা' : 'English'}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="animate-fade-in">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default MainLayout;
