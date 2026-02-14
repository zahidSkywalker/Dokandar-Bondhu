import React from 'react';
import { LayoutDashboard, Package, ShoppingCart, Receipt, Wallet, TrendingUp, Truck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

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
        "flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200 relative group",
        isActive ? "text-orange" : "text-prussian/40"
      )}
    >
      {/* Active Indicator Dot */}
      <div className={cn(
        "absolute -top-1 w-1 h-1 rounded-full bg-orange transition-all",
        isActive ? "opacity-100" : "opacity-0"
      )} />
      
      <div className="p-1.5 rounded-xl transition-all duration-200 group-active:scale-90">
        <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
      </div>
      <span className={cn(
        "text-[10px] font-bold mt-0.5 transition-all",
        isActive ? "text-orange" : "text-prussian/50 group-hover:text-prussian/80"
      )}>
        {label}
      </span>
    </button>
  );
};

const BottomNav: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();
  
  return (
    // Z-Index set to 40. 
    // Since Modals use Portal with z-[100], this will NEVER overlap them.
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 md:border-l md:border-r md:max-w-[480px] mx-auto safe-bottom">
      <div className="flex items-center h-16 px-1">
        {/* ... Nav Items ... */}
        <NavItem icon={LayoutDashboard} label={t('dashboard.title')} isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <NavItem icon={ShoppingCart} label={t('sales.title')} isActive={activeTab === 'sales'} onClick={() => setActiveTab('sales')} />
        <NavItem icon={Package} label={t('inventory.title')} isActive={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
        <NavItem icon={Truck} label={t('suppliers.title')} isActive={activeTab === 'suppliers'} onClick={() => setActiveTab('suppliers')} />
        <NavItem icon={Wallet} label={t('ledger.title')} isActive={activeTab === 'ledger'} onClick={() => setActiveTab('ledger')} />
        <NavItem icon={Receipt} label={t('expenses.title')} isActive={activeTab === 'expenses'} onClick={() => setActiveTab('expenses')} />
        <NavItem icon={TrendingUp} label={t('market.title')} isActive={activeTab === 'market'} onClick={() => setActiveTab('market')} />
      </div>
    </div>
  );
};

export default BottomNav;
