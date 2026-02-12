import React from 'react';
import { LayoutDashboard, Package, ShoppingCart, Receipt, Wallet, TrendingUp } from 'lucide-react';
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
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-2 w-full transition-all duration-300 relative",
        isActive ? "text-white z-10" : "text-gray-400 dark:text-gray-500"
      )}
    >
      {/* Active Background Blob */}
      {isActive && (
        <div className="absolute inset-x-2 top-0 bottom-0 bg-primary rounded-2xl shadow-lg scale-110" />
      )}
      
      <div className="relative z-10 flex flex-col items-center">
        <Icon className={cn("w-6 h-6 mb-1 transition-transform", isActive && "scale-110")} />
        <span className={cn("text-[10px] font-semibold transition-all", isActive ? "opacity-100" : "opacity-70")}>
          {label}
        </span>
      </div>
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
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <div className={`rounded-3xl shadow-2xl border pb-safe pt-2 px-2 backdrop-blur-xl ${
        theme === 'dark' ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-100'
      }`}>
        <div className="flex justify-between items-center max-w-lg mx-auto h-16">
          <NavItem icon={LayoutDashboard} label={t('dashboard.title')} isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={ShoppingCart} label={t('sales.title')} isActive={activeTab === 'sales'} onClick={() => setActiveTab('sales')} />
          <NavItem icon={Receipt} label={t('expenses.title')} isActive={activeTab === 'expenses'} onClick={() => setActiveTab('expenses')} />
          <NavItem icon={Wallet} label={t('ledger.title')} isActive={activeTab === 'ledger'} onClick={() => setActiveTab('ledger')} />
          <NavItem icon={TrendingUp} label={t('market.title')} isActive={activeTab === 'market'} onClick={() => setActiveTab('market')} />
          <NavItem icon={Package} label={t('inventory.title')} isActive={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
