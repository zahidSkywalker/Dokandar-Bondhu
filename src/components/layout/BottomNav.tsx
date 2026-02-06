import React from 'react';
import { LayoutDashboard, Package, ShoppingCart, Receipt, Wallet, TrendingUp, Store, Menu } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, isActive, onClick }) => {
  const { theme } = useTheme(); 

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-1 w-full transition-all duration-300", // Changed p-2 to p-1 for compactness with 7 tabs
        isActive ? "text-earth-800 dark:text-white" : "text-gray-500 dark:text-gray-400" // FIXED: Dark mode inactive text color
      )}
    >
      {/* Icon Container */}
      <div 
        className={cn(
          "p-2 rounded-2xl transition-transform duration-300 flex items-center justify-center", // Added centering
          isActive 
            ? "bg-earth-800 text-white shadow-lg scale-110 animate-bounce" 
            : "bg-transparent dark:bg-transparent"
        )}
        style={{ minWidth: '2rem' }} // FIXED: Prevent icon cutoff
      >
        <Icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
      </div>
      <span className={cn("text-[9px] mt-2 font-semibold", isActive ? "opacity-100" : "opacity-60")}>
        {label}
      </span>
    </button>
  );
};

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  return (
    <div className={`fixed bottom-0 left-0 right-0 backdrop-blur-lg border-t pb-safe pt-2 px-4 z-40 ${
      theme === 'dark' ? 'bg-gray-900/90 border-gray-800' : 'bg-white/90 border-cream-200'
    }`}>
      <div className="flex justify-between items-center max-w-2xl mx-auto"> {/* FIXED: Increased width to max-w-2xl for 7 tabs */}
        
        <NavItem icon={LayoutDashboard} label={t('dashboard.title')} isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <NavItem icon={ShoppingCart} label={t('sales.title')} isActive={activeTab === 'sales'} onClick={() => setActiveTab('sales')} />
        <NavItem icon={Receipt} label={t('expenses.title')} isActive={activeTab === 'expenses'} onClick={() => setActiveTab('expenses')} />
        <NavItem icon={Wallet} label={t('ledger.title')} isActive={activeTab === 'ledger'} onClick={() => setActiveTab('ledger')} />
        
        {/* Suppliers Tab */}
        <NavItem icon={Store} label="Suppliers" isActive={activeTab === 'suppliers'} onClick={() => setActiveTab('suppliers')} />
        
        <NavItem icon={TrendingUp} label={t('market.title')} isActive={activeTab === 'market'} onClick={() => setActiveTab('market')} />
        <NavItem icon={Package} label={t('inventory.title')} isActive={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
      </div>
    </div>
  );
};

export default BottomNav;
