import React, { useState } from 'react';
import { TrendingUp, Package, Wallet, AlertTriangle, ShoppingCart, TrendingDown, Sun, Moon, CloudSun } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency, formatDate } from '../../lib/utils';
import Skeleton from '../ui/Skeleton';
import Modal from '../ui/Modal';

const Dashboard: React.FC = () => {
  const { t, lang } = useLanguage();
  const { theme } = useTheme();
  const { 
    totalSales, totalProfit, totalExpense, netProfit, lowStockCount, 
    recentSales, isLoading, chartData, totalDebt, totalInventoryExpenseMonth,
    totalGeneralExpenseMonth, totalSalesMonth, netMonthlyProfit, stockPredictions,
    salesGrowth, profitInsights
  } = useDashboardStats();

  const [selectedDaySales, setSelectedDaySales] = useState<any[]>([]);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);

  // Smart Greeting Logic
  const getGreetingData = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good Morning", Icon: Sun, color: "text-yellow-500" };
    if (hour < 17) return { text: "Good Afternoon", Icon: CloudSun, color: "text-orange-500" };
    return { text: "Good Evening", Icon: Moon, color: "text-indigo-400" };
  };
  const { text: greetingText, Icon: GreetingIcon, color: greetingColor } = getGreetingData();

  // Chart Click Handler
  const handleBarClick = (data: any) => {
    // In a real app, we would filter sales by the date from the chart data
    // For now, we just show a toast or modal (Logic simplified for display)
    setSelectedDaySales(recentSales); // Simplified: showing recent sales
    setIsDayModalOpen(true);
  };

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6 pb-24 max-w-2xl mx-auto">
      {/* Smart Greeting */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <GreetingIcon className={`w-8 h-8 ${greetingColor}`} />
          <div>
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>{greetingText}</h2>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-earth-600'}`}>Here is your business overview</p>
          </div>
        </div>
        {salesGrowth !== 0 && (
          <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${
            salesGrowth > 0 ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-600'
          }`}>
            {salesGrowth > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(salesGrowth).toFixed(1)}%
          </div>
        )}
      </div>

      {/* Glassmorphism Hero Card */}
      <div className="relative overflow-hidden rounded-3xl shadow-xl">
        {/* Mesh Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-earth-800 opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdjJILTEweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-20" />

        <div className="relative z-10 p-6 text-white">
          <p className="text-sm font-medium opacity-80 mb-1">{t('dashboard.todaySales')}</p>
          <h2 className="text-4xl font-bold tracking-tight mb-6">{formatCurrency(totalSales, lang)}</h2>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="glass-card rounded-xl p-3">
              <p className="text-[10px] uppercase font-bold opacity-70">Revenue</p>
              <p className="font-bold text-lg">{formatCurrency(totalSales, lang)}</p>
            </div>
            <div className="glass-card rounded-xl p-3">
              <p className="text-[10px] uppercase font-bold opacity-70">Profit</p>
              <p className="font-bold text-lg text-green-300">{formatCurrency(totalProfit, lang)}</p>
            </div>
            <div className="glass-card rounded-xl p-3">
              <p className="text-[10px] uppercase font-bold opacity-70">Expense</p>
              <p className="font-bold text-lg text-red-300">{formatCurrency(totalExpense, lang)}</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
            <span className="text-sm font-medium opacity-80">Net Profit Today</span>
            <span className={`text-xl font-bold ${netProfit >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {formatCurrency(netProfit, lang)}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div onClick={() => window.location.hash = '#ledger'} className={`p-5 rounded-2xl border shadow-sm cursor-pointer hover:scale-[1.01] transition-transform ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
          <div className="flex items-center justify-between mb-2">
             <span className="text-xs font-bold uppercase text-earth-500 dark:text-gray-400">{t('ledger.title')}</span>
             <Wallet className="text-earth-400 dark:text-gray-500" size={18} />
          </div>
          <p className={`text-2xl font-bold ${totalDebt > 0 ? 'text-red-500' : (theme === 'dark' ? 'text-white' : 'text-earth-800')}`}>
            {formatCurrency(totalDebt, lang)}
          </p>
        </div>

        <div className={`p-5 rounded-2xl border shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
          <div className="flex items-center justify-between mb-2">
             <span className="text-xs font-bold uppercase text-earth-500 dark:text-gray-400">Low Stock</span>
             <Package className={lowStockCount > 0 ? 'text-red-500' : 'text-earth-400 dark:text-gray-500'} size={18} />
          </div>
          <p className={`text-2xl font-bold ${lowStockCount > 0 ? 'text-red-600' : (theme === 'dark' ? 'text-white' : 'text-earth-800')}`}>
            {lowStockCount} <span className="text-xs font-normal">items</span>
          </p>
        </div>
      </div>

      {/* Interactive Chart */}
      <div className={`p-5 rounded-2xl border shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
        <h3 className={`font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>Weekly Trend</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={24}>
              <XAxis dataKey="date" tick={{fontSize: 10, fill: theme === 'dark' ? '#9ca3af' : '#8B5E3C'}} axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: theme === 'dark' ? '#374151' : '#F5F2EB'}} contentStyle={{borderRadius: '12px', border: 'none', backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', color: theme === 'dark' ? '#fff' : '#000'}} />
              <Bar dataKey="sales" fill="var(--color-primary)" radius={[6, 6, 0, 0]} onClick={handleBarClick} className="cursor-pointer">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? 'var(--color-primary)' : (theme === 'dark' ? '#374151' : '#E6E0D6')} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Sales */}
      <div>
        <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'} mb-4`}>{t('dashboard.recentSales')}</h3>
        <div className="space-y-3">
          {recentSales.length === 0 ? (
             <div className={`p-10 text-center rounded-2xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
               <ShoppingCart className="mx-auto text-earth-200 mb-3 dark:text-gray-600" size={48} />
               <p className={`font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-earth-400'}`}>No transactions today</p>
               <button className="mt-3 text-sm font-bold text-primary">Record your first sale</button>
             </div>
          ) : (
            recentSales.map((sale) => (
              <div key={sale.id} className={`p-4 rounded-2xl border shadow-sm flex justify-between items-center ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-primary/10 text-primary dark:text-white`}>
                        <ShoppingCart size={18}/>
                    </div>
                    <div>
                        <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>{sale.productName}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold bg-primary/10 text-primary dark:bg-gray-700 dark:text-gray-300`}>{sale.quantity} pcs</span>
                            <span className={`text-[10px] ${theme === 'dark' ? 'text-gray-500' : 'text-earth-400'}`}>{formatDate(sale.date, lang)}</span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>{formatCurrency(sale.total, lang)}</p>
                  <p className={`text-[10px] text-green-600 font-medium`}>+{formatCurrency(sale.profit, lang)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Day Sales Modal */}
      <Modal isOpen={isDayModalOpen} onClose={() => setIsDayModalOpen(false)} title="Sales Details">
        <p className="text-sm text-gray-500">Details for selected day:</p>
        <div className="mt-4 space-y-2">
            {selectedDaySales.map(s => (
                <div key={s.id} className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg flex justify-between">
                    <span>{s.productName}</span>
                    <span className="font-bold">{formatCurrency(s.total, lang)}</span>
                </div>
            ))}
        </div>
      </Modal>
    </div>
  );
};

const DashboardSkeleton = () => (
  <div className="space-y-6 pb-24 max-w-2xl mx-auto animate-pulse">
    <div className="flex items-center gap-3 mb-8">
      <Skeleton className="w-8 h-8 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
    <Skeleton className="h-48 w-full rounded-3xl" />
    <div className="grid grid-cols-2 gap-4">
      <Skeleton className="h-24 rounded-2xl" />
      <Skeleton className="h-24 rounded-2xl" />
    </div>
    <Skeleton className="h-48 w-full rounded-2xl" />
  </div>
);

export default Dashboard;
