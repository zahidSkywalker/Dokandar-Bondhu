import React from 'react';
import { ArrowUpRight, ArrowDownRight, Package, TrendingUp, Wallet, AlertTriangle, ShoppingCart, TrendingDown } from 'lucide-react';
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
    netProfit, 
    lowStockCount, 
    recentSales, 
    isLoading, 
    chartData,
    greeting,
    totalDebt,
    totalInventoryExpenseMonth,
    totalExpenseMonth,
    totalSalesMonth,
    netMonthlyProfit,
    stockPredictions,
    salesGrowth,
    profitInsights
  } = useDashboardStats();

  const GreetingIcon = getGreetingIcon();

  if (isLoading) return <div className="p-4 text-center text-slate-500 dark:text-slate-400">Loading...</div>;

  return (
    <div className="space-y-6 pb-24 max-w-2xl mx-auto">
      {/* Greeting Header */}
      <div className="mb-2 animate-fade-in flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-full ${theme === 'dark' ? 'bg-primary-900/30 text-primary-400' : 'bg-primary-50 text-primary-600'}`}>
            <GreetingIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{greeting}</h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Business Overview</p>
          </div>
        </div>
        
        {/* Growth Badge */}
        {salesGrowth !== 0 && (
          <div className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full border ${
            salesGrowth > 0 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900' 
              : 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900'
          }`}>
            {salesGrowth > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(salesGrowth).toFixed(1)}% vs Yest.
          </div>
        )}
      </div>

      {/* Main Stats Card - "Modern Khata" Teal */}
      <div className={`
        relative overflow-hidden rounded-2xl p-6 shadow-lg shadow-primary-500/10
        ${theme === 'dark' 
          ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700' 
          : 'bg-gradient-to-br from-primary-700 to-primary-900 border border-primary-800'
        } text-white`}>
        
        <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
           <Wallet size={120} />
        </div>

        <div className="relative z-10">
          <p className="text-primary-100 dark:text-slate-300 text-sm font-medium mb-2 tracking-wide uppercase opacity-90">
            {t('dashboard.todaySales')}
          </p>
          <h2 className="text-4xl font-bold tracking-tight mb-6 font-mono">
            {formatCurrency(totalSales, lang)}
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/5">
              <p className="text-primary-100 dark:text-slate-400 text-xs mb-1">Profit</p>
              <p className="font-bold text-emerald-300 text-lg">{formatCurrency(totalProfit, lang)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/5">
              <p className="text-primary-100 dark:text-slate-400 text-xs mb-1">Expense</p>
              <p className="font-bold text-red-300 text-lg">{formatCurrency(totalExpense, lang)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profit Insights - Clean List View */}
      {profitInsights && (
        <div className={`
          p-5 rounded-2xl border shadow-sm transition-colors duration-300
          ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}
        `}>
          <h3 className={`font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            <TrendingUp className="text-primary-500" size={18} /> Profit Insights
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Top Performers</p>
              {profitInsights.top5.slice(0, 3).map((p, i) => (
                <div key={i} className="flex justify-between text-xs items-center py-1 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <span className="truncate w-28 font-medium text-slate-700 dark:text-slate-300">{p.name}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {formatCurrency(p.totalProfit, lang)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Needs Attention</p>
              {profitInsights.bottom5.slice(0, 3).map((p, i) => (
                <div key={i} className="flex justify-between text-xs items-center py-1 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <span className="truncate w-28 font-medium text-slate-700 dark:text-slate-300">{p.name}</span>
                  <span className="font-bold text-orange-500 dark:text-orange-400 font-mono">
                    {formatCurrency(p.totalProfit, lang)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Monthly Analysis */}
      <div className={`
        p-5 rounded-2xl border shadow-sm
        ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}
      `}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Monthly Analysis</h3>
          <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider ${
            theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
          }`}>This Month</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
           <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
             <p className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Total Sales</p>
             <p className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(totalSalesMonth, lang)}</p>
           </div>
           <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
             <p className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Inventory Cost</p>
             <p className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(totalInventoryExpenseMonth, lang)}</p>
           </div>
        </div>

        <div className={`
          p-4 rounded-xl mb-2 border-l-4
          ${netMonthlyProfit >= 0 
            ? 'bg-emerald-50/50 border-emerald-500 dark:bg-emerald-900/10 dark:border-emerald-600' 
            : 'bg-red-50/50 border-red-500 dark:bg-red-900/10 dark:border-red-600'
          }
        `}>
          <p className={`text-xs font-bold mb-1 uppercase tracking-wide ${netMonthlyProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            Net Monthly Profit
          </p>
          <p className={`text-2xl font-bold font-mono ${netMonthlyProfit >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>
            {formatCurrency(netMonthlyProfit, lang)}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <div onClick={() => window.location.hash = '#ledger'} className={`
          p-4 rounded-2xl border shadow-sm cursor-pointer hover:border-primary-300 dark:hover:border-primary-700 transition-all active:scale-[0.98] group
          ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}
        `}>
          <div className="flex items-center justify-between mb-2">
             <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{t('ledger.title')}</span>
             <Wallet className="text-slate-400 group-hover:text-primary-500 transition-colors" size={18} />
          </div>
          <p className={`text-xl font-bold font-mono ${totalDebt > 0 ? 'text-red-500' : (theme === 'dark' ? 'text-white' : 'text-slate-900')}`}>
            {formatCurrency(totalDebt, lang)}
          </p>
        </div>

        <div className={`
          p-4 rounded-2xl border shadow-sm
          ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}
        `}>
          <div className="flex items-center justify-between mb-2">
             <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Low Stock</span>
             <Package className={lowStockCount > 0 ? 'text-red-500' : 'text-slate-400'} size={18} />
          </div>
          <p className={`text-xl font-bold font-mono ${lowStockCount > 0 ? 'text-red-500' : (theme === 'dark' ? 'text-white' : 'text-slate-900')}`}>
            {lowStockCount} <span className="text-xs font-normal text-slate-500">items</span>
          </p>
        </div>
      </div>

      {/* Stock Prediction */}
      <div className={`
        p-5 rounded-2xl border shadow-sm
        ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}
      `}>
        <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-4 flex items-center gap-2`}>
          <AlertTriangle className="text-accent-500" size={18} /> Stock Prediction
        </h3>
        
        {!stockPredictions || stockPredictions.length === 0 ? (
           <div className="p-8 text-center text-slate-400 dark:text-slate-500">
             <Package size={32} className="mx-auto mb-2 opacity-20" />
             No stock data available.
           </div>
        ) : (
          <div className="space-y-2">
             {stockPredictions
               .filter(p => p.daysLeft < 999)
               .sort((a, b) => a.daysLeft - b.daysLeft)
               .slice(0, 5)
               .map((product) => {
                  const isCritical = product.daysLeft < 3;
                  return (
                    <div key={product.id} className={`
                      flex justify-between items-center p-3 rounded-lg border
                      ${isCritical 
                        ? 'bg-red-50/50 border-red-100 dark:bg-red-900/10 dark:border-red-900/50' 
                        : 'bg-orange-50/50 border-orange-100 dark:bg-orange-900/10 dark:border-orange-900/50'
                      }
                    `}>
                      <div className="flex items-center gap-3">
                         <div className={`w-2 h-2 rounded-full ${isCritical ? 'bg-red-500' : 'bg-orange-500'}`} />
                         <span className={`font-medium text-sm ${isCritical ? 'text-red-700 dark:text-red-300' : 'text-orange-700 dark:text-orange-300'}`}>
                           {product.name}
                         </span>
                      </div>
                      <span className={`text-xs font-bold font-mono ${isCritical ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'}`}>
                         {product.daysLeft === 999 ? 'No Sales Data' : `${product.daysLeft} Days Left`}
                      </span>
                    </div>
                  );
                })
             }
          </div>
        )}
      </div>

      {/* Charts & Recent List */}
      <div className={`
        p-5 rounded-2xl border shadow-sm
        ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}
      `}>
        <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-6`}>Weekly Trend</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={16}>
              <XAxis dataKey="date" tick={{fontSize: 10, fill: theme === 'dark' ? '#94a3b8' : '#64748b'}} axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: theme === 'dark' ? '#1e293b' : '#fff', color: theme === 'dark' ? '#e2e8f0' : '#0f172a'}} formatter={(value: number) => [formatCurrency(value, lang), 'Sales']} />
              <Bar dataKey="sales" fill="#0d9488" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-4`}>{t('dashboard.recentSales')}</h3>
        <div className="space-y-3">
          {recentSales.length === 0 ? (
             <div className={`
               p-10 text-center rounded-2xl border
               ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}
             `}>
               <p className={theme === 'dark' ? 'text-slate-400 font-medium' : 'text-slate-400 font-medium'}>No transactions today</p>
             </div>
          ) : (
            recentSales.map((sale) => (
              <div key={sale.id} className={`
                p-4 rounded-xl border shadow-sm flex justify-between items-center transition-colors
                ${theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-100 hover:border-slate-200'}
              `}>
                <div>
                  <p className={`font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{sale.productName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                      theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                    }`}>{sale.quantity} pcs</span>
                    <span className={`text-[10px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{formatDate(sale.date, lang)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-lg font-mono ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(sale.total, lang)}</p>
                  <p className={`text-[10px] font-medium text-emerald-600 dark:text-emerald-400`}>+{formatCurrency(sale.profit, lang)}</p>
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
