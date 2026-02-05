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
        "group flex flex-col items-center justify-center p-2 w-full transition-all duration-300 relative",
        isActive ? "text-primary-600 dark:text-primary-400" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400"
      )}
    >
      {/* Icon Container */}
      <div className={cn(
        "p-2.5 rounded-2xl transition-all duration-300 relative",
        isActive 
          ? "bg-primary-50 dark:bg-primary-900/20 shadow-sm" 
          : "bg-transparent group-hover:bg-slate-50 dark:group-hover:bg-slate-800/50"
      )}>
        <Icon className={cn("w-6 h-6 transition-transform duration-300", isActive && "scale-110")} strokeWidth={isActive ? 2.5 : 2} />
        
        {/* Active Dot Indicator */}
        {isActive && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
        )}
      </div>
      
      <span className={cn(
        "text-[10px] font-medium mt-1.5 transition-colors duration-300", 
        isActive ? "text-slate-900 dark:text-white opacity-100" : "opacity-70"
      )}>
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
    <div className={`
      fixed bottom-0 left-0 right-0 z-40 pb-safe pt-2 px-2 border-t backdrop-blur-xl transition-colors duration-300
      ${theme === 'dark' ? 'bg-slate-900/95 border-slate-800' : 'bg-white/90 border-slate-200'}
    `}>
      <div className="flex justify-between items-center max-w-lg mx-auto">
        <NavItem icon={LayoutDashboard} label={t('dashboard.title')} isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <NavItem icon={ShoppingCart} label={t('sales.title')} isActive={activeTab === 'sales'} onClick={() => setActiveTab('sales')} />
        <NavItem icon={Receipt} label={t('expenses.title')} isActive={activeTab === 'expenses'} onClick={() => setActiveTab('expenses')} />
        <NavItem icon={Wallet} label={t('ledger.title')} isActive={activeTab === 'ledger'} onClick={() => setActiveTab('ledger')} />
        <NavItem icon={TrendingUp} label={t('market.title')} isActive={activeTab === 'market'} onClick={() => setActiveTab('market')} />
        <NavItem icon={Package} label={t('inventory.title')} isActive={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
      </div>
    </div>
  );
};

export default BottomNav;
