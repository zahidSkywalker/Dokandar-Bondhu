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
  const { theme } = useTheme();

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-2 w-full transition-all duration-200 relative z-10"
      )}
    >
      {/* Active Background Pill */}
      {isActive && (
        <div className="absolute inset-x-1.5 top-1 bottom-1 bg-primary rounded-2xl shadow-md" />
      )}
      
      <div className="relative z-10 flex flex-col items-center gap-1">
        <Icon className={cn("w-5 h-5 transition-colors duration-200", isActive ? "text-white" : "text-gray-400 dark:text-gray-500")} />
        <span className={cn("text-[10px] font-bold transition-colors duration-200", isActive ? "text-white" : "text-gray-400 dark:text-gray-500")}>
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
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-2 pointer-events-none">
      <div className={`pointer-events-auto max-w-lg mx-auto rounded-3xl shadow-2xl border backdrop-blur-xl ${
        theme === 'dark' ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-100'
      }`}>
        <div className="flex justify-between items-center h-16 px-2">
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
