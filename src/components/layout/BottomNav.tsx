import React from 'react';
import { LayoutDashboard, Package, ShoppingCart, Receipt, Home } from 'lucide-react';
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
      "flex flex-col items-center justify-center p-2 w-full transition-colors",
      isActive ? "text-teal-600" : "text-gray-400"
    )}
  >
    <Icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
    <span className="text-[10px] mt-1 font-medium">{label}</span>
  </button>
);

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { t, lang } = useLanguage();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe pt-2 px-6 z-40 shadow-lg">
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
