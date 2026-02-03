import React from 'react';
import { LayoutDashboard, Package, ShoppingCart, Receipt } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center p-2 w-full transition-all duration-300",
      isActive ? "text-earth-800" : "text-earth-400"
    )}
  >
    <div className={cn(
      "p-2 rounded-2xl transition-all duration-300",
      isActive ? "bg-cream-200 shadow-sm scale-110" : ""
    )}>
      <Icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
    </div>
    <span className={cn("text-[10px] mt-2 font-semibold", isActive ? "opacity-100" : "opacity-60")}>{label}</span>
  </button>
);

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-cream-200 pb-safe pt-2 px-6 z-40 shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
      <div className="flex justify-between items-center max-w-md mx-auto">
        <NavItem 
          icon={LayoutDashboard} 
          label={t('dashboard.title')} 
          isActive={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
        />
        <NavItem 
          icon={ShoppingCart} 
          label={t('sales.title')} 
          isActive={activeTab === 'sales'} 
          onClick={() => setActiveTab('sales')} 
        />
        <NavItem 
          icon={Package} 
          label={t('inventory.title')} 
          isActive={activeTab === 'inventory'} 
          onClick={() => setActiveTab('inventory')} 
        />
        <NavItem 
          icon={Receipt} 
          label={t('expenses.title')} 
          isActive={activeTab === 'expenses'} 
          onClick={() => setActiveTab('expenses')} 
        />
      </div>
    </div>
  );
};

export default BottomNav;
