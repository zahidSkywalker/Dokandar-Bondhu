import React from 'react';
import { ArrowUpRight, ArrowDownRight, Package, TrendingUp, Wallet, AlertTriangle, ShoppingCart } from 'lucide-react';
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
    stockPredictions
  } = useDashboardStats();

  const GreetingIcon = getGreetingIcon();
   // NEW: Helper to get prediction details for a product
  const getPrediction = (productId: number) => {
    const prediction = stockPredictions.find(p => p.productId === productId);
    return prediction || { alertLevel: 'normal' }; // Fallback
  };
  if (isLoading) return <div className="p-4 text-center">Loading...</div>;

  const monthlyData = [
    { name: 'Sales', value: totalSalesMonth },
    { name: 'Expenses', value: totalExpenseMonth + totalInventoryExpenseMonth },
    { name: 'Inventory Cost', value: totalInventoryExpenseMonth },
  ];

  return (
    <div className="space-y-6 pb-24 max-w-2xl mx-auto">
      {/* Greeting */}
      <div className="mb-2 animate-fade-in flex items-center gap-3">
        <GreetingIcon className="text-yellow-500 w-8 h-8" />
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>{greeting}</h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-earth-600'}`}>Here is your business overview</p>
        </div>
      </div>

      {/* Main Stats Card */}
      <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'} bg-gradient-to-br from-earth-600 to-earth-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden`}>
        <div className="absolute top-0 right-0 p-4 opacity-10"><Wallet size={120} /></div>
        <p className="text-earth-100 text-sm font-medium mb-1 opacity-90">{t('dashboard.todaySales')}</p>
        <h2 className="text-4xl font-bold tracking-tight mb-4">{formatCurrency(totalSales, lang)}</h2>
        
        <div className="flex gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 flex-1 border border-white/10">
            <p className="text-earth-100 text-xs mb-1">Profit</p>
            <p className="font-bold text-green-300">{formatCurrency(totalProfit, lang)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 flex-1 border border-white/10">
            <p className="text-earth-100 text-xs mb-1">Expense</p>
            <p className="font-bold text-red-300">{formatCurrency(totalExpense, lang)}</p>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className={`p-5 rounded-2xl border shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>Monthly Analysis</h3>
          <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-cream-100 text-earth-600'}`}>This Month</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
           <div>
             <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-earth-500'}`}>Total Sales</p>
             <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>{formatCurrency(totalSalesMonth, lang)}</p>
           </div>
           <div>
             <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-earth-500'}`}>Inventory Cost</p>
             <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>{formatCurrency(totalInventoryExpenseMonth, lang)}</p>
           </div>
        </div>

        <div className={`p-4 rounded-xl mb-4 ${netMonthlyProfit >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'} border ${netMonthlyProfit >= 0 ? 'border-green-100 dark:border-green-900' : 'border-red-100 dark:border-red-900'} mb-4`}>
          <p className={`text-xs font-bold mb-1 uppercase ${netMonthlyProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>Net Monthly Profit</p>
          <p className={`text-2xl font-bold ${netMonthlyProfit >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
            {formatCurrency(netMonthlyProfit, lang)}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <div onClick={() => window.location.hash = '#ledger'} className={`p-4 rounded-2xl border shadow-sm cursor-pointer hover:opacity-90 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
          <div className="flex items-center justify-between mb-2">
             <span className="text-xs font-bold uppercase text-earth-500 dark:text-gray-400">{t('ledger.title')}</span>
             <Wallet className="text-earth-400 dark:text-gray-500" size={18} />
          </div>
          <p className={`text-xl font-bold ${totalDebt > 0 ? 'text-red-500' : (theme === 'dark' ? 'text-white' : 'text-earth-800')}`}>
            {formatCurrency(totalDebt, lang)}
          </p>
        </div>

        <div className={`p-4 rounded-2xl border shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
          <div className="flex items-center justify-between mb-2">
             <span className="text-xs font-bold uppercase text-earth-500 dark:text-gray-400">Low Stock</span>
             <Package className={lowStockCount > 0 ? 'text-red-500' : 'text-earth-400 dark:text-gray-500'} size={18} />
          </div>
          <p className={`text-xl font-bold ${lowStockCount > 0 ? 'text-red-600' : (theme === 'dark' ? 'text-white' : 'text-earth-800')}`}>
            {lowStockCount} <span className="text-xs font-normal">items</span>
          </p>
        </div>
      </div>

      {/* NEW: Smart Low Stock Alert Section */}
        <div className={`p-4 rounded-2xl border shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'} flex items-center gap-2`}>
              <AlertTriangle className="text-yellow-500" size={18} /> 
              {t('dashboard.stockAlert')}
            </h3>
            <span className={`text-xs font-bold uppercase ${theme === 'dark' ? 'text-gray-400' : 'text-earth-400'}`}>
              {stockPredictions.filter(p => p.alertLevel === 'critical').length} Critical
            </span>
          </div>

          <div className="space-y-3">
            {stockPredictions.length === 0 ? (
              <div className="p-4 text-center text-gray-400 dark:text-gray-500">
                <Package size={32} className="mx-auto mb-2 opacity-20" />
                <p className="font-medium">No stock data available. Sales history required.</p>
              </div>
            ) : (
              stockPredictions.slice(0, 5).map((item) => {
                const prediction = getPrediction(item.productId);
                const isCritical = prediction.alertLevel === 'critical';
                const isWarning = prediction.alertLevel === 'warning';

                return (
                  <div 
                    key={item.productId} 
                    className={`flex justify-between items-center p-3 rounded-lg border ${
                      isCritical 
                        ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900' 
                        : isWarning
                          ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900'
                          : 'bg-white dark:bg-gray-800 border-cream-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex-1">
                      <div>
                        <h4 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>
                          {item.productName}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded bg-earth-50 dark:bg-earth-900/30 text-earth-600 dark:text-earth-400 font-bold uppercase`}>
                            Stock: {item.currentStock}
                          </span>
                          <span className={`text-xs font-bold ${prediction.daysLeft === 999 ? 'text-gray-400' : (isCritical ? 'text-red-600' : 'text-orange-600')}`}>
                            ({prediction.daysLeft === 999 ? 'No Data' : prediction.daysLeftText})
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* NEW: Dynamic Badges */}
                    <div className="flex flex-col items-center gap-2">
                      <Badge variant={prediction.alertLevel}>
                        {prediction.daysLeft === 999 ? 'Unknown' : isCritical ? 'Critical' : 'Warning'}
                      </Badge>
                      {prediction.daysLeft !== 999 && (
                        <span className="text-[10px] text-gray-500">
                          Avg: {prediction.avgDailySales.toFixed(1)}/day
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
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
                <div>
                  <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>{sale.productName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-cream-100 text-earth-600'}`}>{sale.quantity} pcs</span>
                    <span className={`text-[10px] ${theme === 'dark' ? 'text-gray-500' : 'text-earth-400'}`}>{formatDate(sale.date, lang)}</span>
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
