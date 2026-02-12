import React from 'react';
import { TrendingUp, Package, Wallet, AlertTriangle, ShoppingCart, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency, formatDate, getGreetingIcon } from '../../lib/utils';

const Dashboard: React.FC = () => {
  const { t, lang } = useLanguage();
  const { theme } = useTheme();
  const { 
    totalSales, 
    totalProfit, 
    totalExpense, 
    netProfit, // Use this
    lowStockCount, 
    recentSales, 
    isLoading, 
    chartData,
    greeting,
    totalDebt,
    totalInventoryExpenseMonth,
    totalGeneralExpenseMonth,
    totalSalesMonth,
    netMonthlyProfit,
    stockPredictions,
    salesGrowth,
    profitInsights
  } = useDashboardStats();

  const GreetingIcon = getGreetingIcon();

  if (isLoading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="space-y-6 pb-24 max-w-2xl mx-auto">
      {/* Greeting */}
      <div className="mb-2 animate-fade-in flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GreetingIcon className="text-yellow-500 w-8 h-8" />
          <div>
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>{greeting}</h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-earth-600'}`}>Here is your business overview</p>
          </div>
        </div>
        
        {/* Growth Indicator */}
        {salesGrowth !== 0 && (
          <div className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${
            salesGrowth > 0 ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {salesGrowth > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(salesGrowth).toFixed(1)}%
          </div>
        )}
      </div>

      {/* Main Stats Card - Fixed Layout */}
      <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-br from-earth-600 to-earth-800'} rounded-3xl p-6 text-white shadow-xl relative overflow-hidden`}>
        <div className="absolute top-0 right-0 p-4 opacity-10"><Wallet size={120} /></div>
        
        <div className="relative z-10">
            <p className="text-earth-100 text-sm font-medium mb-1 opacity-90">{t('dashboard.todaySales')}</p>
            <h2 className="text-4xl font-bold tracking-tight mb-6">{formatCurrency(totalSales, lang)}</h2>
            
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                    <p className="text-earth-100 text-[10px] uppercase font-bold mb-1">Revenue</p>
                    <p className="font-bold text-lg">{formatCurrency(totalSales, lang)}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                    <p className="text-earth-100 text-[10px] uppercase font-bold mb-1">Profit</p>
                    <p className="font-bold text-lg text-green-300">{formatCurrency(totalProfit, lang)}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                    <p className="text-earth-100 text-[10px] uppercase font-bold mb-1">Expense</p>
                    <p className="font-bold text-lg text-red-300">{formatCurrency(totalExpense, lang)}</p>
                </div>
            </div>

            {/* Net Profit Display */}
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-sm font-medium opacity-90">Net Profit Today</span>
                <span className={`text-xl font-bold ${netProfit >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {formatCurrency(netProfit, lang)}
                </span>
            </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div onClick={() => window.location.hash = '#ledger'} className={`p-5 rounded-2xl border shadow-sm cursor-pointer hover:opacity-90 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
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

      {/* Profit Insights */}
      {profitInsights && (
        <div className={`p-5 rounded-2xl border shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
          <h3 className={`font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>
            <TrendingUp className="text-blue-500" size={18} /> Profit Insights
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-earth-500 dark:text-gray-400 mb-2 uppercase">Top Performers</p>
              <div className="space-y-2">
                {profitInsights.top5.slice(0, 3).map((p, i) => (
                  <div key={i} className="flex justify-between text-xs items-center">
                    <span className="truncate w-24 font-medium text-gray-700 dark:text-gray-300">{p.name}</span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(p.totalProfit, lang)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-xs font-bold text-earth-500 dark:text-gray-400 mb-2 uppercase">Needs Attention</p>
              <div className="space-y-2">
                {profitInsights.bottom5.slice(0, 3).map((p, i) => (
                  <div key={i} className="flex justify-between text-xs items-center">
                    <span className="truncate w-24 font-medium text-gray-700 dark:text-gray-300">{p.name}</span>
                    <span className="font-bold text-orange-600 dark:text-orange-400">
                      {formatCurrency(p.totalProfit, lang)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Breakdown */}
      <div className={`p-5 rounded-2xl border shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>Monthly Analysis</h3>
        </div>
        
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-earth-500'}`}>Total Sales</span>
                <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>{formatCurrency(totalSalesMonth, lang)}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-earth-500'}`}>Inventory Cost</span>
                <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>{formatCurrency(totalInventoryExpenseMonth, lang)}</span>
            </div>
             <div className="flex justify-between items-center">
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-earth-500'}`}>Operational Expenses</span>
                <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>{formatCurrency(totalGeneralExpenseMonth, lang)}</span>
            </div>
            <div className={`border-t pt-3 mt-3 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}></div>
             <div className="flex justify-between items-center">
                <span className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-earth-700'}`}>Net Monthly Profit</span>
                <span className={`text-xl font-bold ${netMonthlyProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatCurrency(netMonthlyProfit, lang)}
                </span>
            </div>
        </div>
      </div>

      {/* Charts & Recent List */}
      <div className={`p-5 rounded-2xl border shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
        <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'} mb-6`}>Weekly Trend</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={20}>
              <XAxis dataKey="date" tick={{fontSize: 10, fill: theme === 'dark' ? '#9ca3af' : '#8B5E3C'}} axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: theme === 'dark' ? '#374151' : '#F5F2EB'}} contentStyle={{borderRadius: '12px', border: '1px solid #E6E0D6', backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', color: theme === 'dark' ? '#fff' : '#000'}} formatter={(value: number) => [formatCurrency(value, lang), 'Sales']} />
              <Bar dataKey="sales" fill="#8B5E3C" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'} mb-4`}>{t('dashboard.recentSales')}</h3>
        <div className="space-y-3">
          {recentSales.length === 0 ? (
             <div className={`p-10 text-center rounded-2xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
               <p className={theme === 'dark' ? 'text-gray-400 font-medium' : 'text-earth-400 font-medium'}>No transactions today</p>
             </div>
          ) : (
            recentSales.map((sale) => (
              <div key={sale.id} className={`p-4 rounded-2xl border shadow-sm flex justify-between items-center ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-cream-100'}`}>
                        <ShoppingCart size={18} className="text-earth-600 dark:text-earth-400"/>
                    </div>
                    <div>
                        <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>{sale.productName}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-cream-100 text-earth-600'}`}>{sale.quantity} pcs</span>
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
    </div>
  );
};

export default Dashboard;
