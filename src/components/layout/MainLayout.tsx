import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Receipt, 
  Wallet, 
  TrendingUp, 
  Bell,
  Settings as SettingsIcon, 
  Moon, 
  Sun 
} from 'lucide-react';
import BottomNav from './BottomNav';
import Dashboard from '../views/Dashboard';
import Inventory from '../views/Inventory';
import Sales from '../views/Sales';
import Expenses from '../views/Expenses';
import Ledger from '../views/Ledger';
import Suppliers from '../views/Suppliers'; // NEW: Feature 3
import Market from '../views/Market'; // NEW: Feature 1
import ProfitInsights from '../views/ProfitInsights'; // NEW: Feature 4
import Notifications from '../views/Notifications'; // NEW: Feature 6
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
// Import the scheduler to start it on mount
import { startScheduler } from '../../services/notificationScheduler'; // NEW: Step 2 Scheduler

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { t, lang, toggleLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { triggerNotification } = useApp(); // Get the trigger function from context

  // ==========================================
  // INITIALIZATION (NEW: Start Notification Scheduler)
  // ==========================================
  useEffect(() => {
    // Start the business logic loop (Low Stock, Reports, Due Payments)
    startScheduler(triggerNotification);
  }, []);

  // ==========================================
  // RENDER LOGIC
  // ==========================================
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'inventory': return <Inventory />;
      case 'sales': return <Sales />;
      case 'expenses': return <Expenses />;
      case 'ledger': return <Ledger />; // Feature 1: Baki Khata
      case 'market': return <Market />;   // Feature 1: Market Prices
      case 'notifications': return <Notifications />; // Feature 6: Notifications
      case 'insights': return <ProfitInsights />; // Feature 4: Profit Insights
      case 'suppliers': return <Suppliers />; // Feature 3: Suppliers
      case 'settings': return <Settings />; // Settings
      default: return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen font-sans pb-20 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-cream-50 text-earth-900'}`}>
      
      {/* ==========================================
        HEADER
        ========================================== */}
      <header className={`sticky top-0 z-30 border-b px-4 py-4 flex justify-between items-center ${
        theme === 'dark' ? 'bg-gray-800/90 border-gray-700 backdrop-blur-md' : 'bg-white/80 border-cream-200 backdrop-blur-md shadow-sm'
      }`}>
        <div>
          <h1 className={`font-bold text-xl tracking-tight ${theme === 'dark' ? 'text-white' : 'text-earth-800'}`}>
            {t('common.appName')}
          </h1>
          <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-earth-600'}`}>
            Business Manager
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* ==========================================
           NOTIFICATIONS TRIGGER (NEW - Feature 6)
           ========================================== */}
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`p-2 rounded-xl transition-colors ${
              activeTab === 'notifications' 
                ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-500 shadow-lg' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500'
            }`}
          >
            <Bell size={20} className={activeTab === 'notifications' ? 'text-yellow-700' : 'text-gray-500'} />
          </button>

          {/* ==========================================
           SETTINGS TRIGGER
           ========================================== */}
          <button 
            onClick={() => setActiveTab('settings')}
            className={`p-2 rounded-xl transition-colors ${
              activeTab === 'settings' 
                ? 'bg-earth-50 text-earth-600 ring-2 ring-earth-600' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500'
            }`}
          >
            <SettingsIcon size={20} />
          </button>
          
          {/* ==========================================
           LANGUAGE TOGGLE
           ========================================== */}
          <button 
            onClick={toggleLang}
            className={`text-xs px-3 py-1.5 rounded-full font-bold border transition-colors ${
              theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-earth-50 border-earth-100 text-earth-800'
            }`}
          >
            {lang === 'en' ? 'বাংলা' : 'English'}
          </button>
          
          {/* ==========================================
           THEME TOGGLE
           ========================================== */}
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-gray-700 text-yellow-400' : 'bg-earth-50 text-earth-600'}`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* ==========================================
        MAIN CONTENT
        ========================================== */}
      <main className="animate-fade-in px-4 pt-4">
        {renderContent()}
      </main>

      {/* ==========================================
        BOTTOM NAVIGATION
        ==========================================
      <BottomNav activeTab={activeTab} { /* Added to this in Step 2 update */ }
    </div>
  );
};

export default MainLayout;
