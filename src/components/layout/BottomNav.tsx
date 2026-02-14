import React from 'react';
import { LayoutDashboard, Package, ShoppingCart, Receipt, Wallet, TrendingUp } from 'lucide-react';
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
    <button onClick={onClick} className={cn("flex flex-col items-center justify-center p-2 w-full transition-all duration-300 relative rounded-xl", isActive && "bg-orange shadow-lg scale-110")}>
      <div className="flex flex-col items-center gap-1">
        <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-prussian" : "text-prussian/50")} />
        <span className={cn("text-[10px] font-bold transition-colors", isActive ? "text-prussian" : "text-prussian/50")}>{label}</span>
      </div>
    </button>
  );
};

const BottomNav: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();
  return (
    <div className="bottom-4 left-4 right-4 z-50 animate-slide-up">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 px-2 py-2">
        <div className="flex justify-between items-center h-16">
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
