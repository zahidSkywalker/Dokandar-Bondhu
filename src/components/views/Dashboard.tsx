import React from 'react';
import { TrendingUp, Package, Wallet, ShoppingCart, TrendingDown, Sun, CloudSun, Moon, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import { formatCurrency, formatDate } from '../../lib/utils';

const Dashboard: React.FC = () => {
  const { t, lang } = useLanguage();
  const { businessName } = useSettings();
  const { 
    totalSales, totalProfit, totalExpense, netProfit, lowStockCount, 
    recentSales, isLoading, chartData, totalDebt, totalInventoryExpenseMonth,
    totalGeneralExpenseMonth, totalSalesMonth, netMonthlyProfit, stockPredictions,
    salesGrowth, profitInsights
  } = useDashboardStats();

  const getGreetingData = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good Morning", Icon: Sun };
    if (hour < 17) return { text: "Good Afternoon", Icon: CloudSun };
    return { text: "Good Evening", Icon: Moon };
  };
  const { text: greetingText, Icon: GreetingIcon } = getGreetingData();

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-prussian rounded-xl text-orange shadow-md">
            <GreetingIcon size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-prussian font-display">{greetingText},</h2>
            <p className="text-sm font-semibold text-prussian/70">{businessName}</p>
          </div>
        </div>
        {salesGrowth !== 0 && (
          <div className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full shadow-sm ${
            salesGrowth > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {salesGrowth > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(salesGrowth).toFixed(1)}%
          </div>
        )}
      </div>

      {/* Hero Card */}
      <div className="bg-prussian rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
            <Wallet size={140} className="text-white transform translate-x-4 -translate-y-4" />
        </div>
        <div className="relative z-10">
          <p className="text-alabaster text-xs font-bold uppercase tracking-wider">{t('dashboard.todaySales')}</p>
          <h2 className="text-4xl font-bold tracking-tight my-2 font-display">{formatCurrency(totalSales, lang)}</h2>
          
          <div className="grid grid-cols-3 gap-2 mt-6">
            <div className="bg-white/10 rounded-xl p-2 text-center backdrop-blur-sm border border-white/10">
              <p className="text-[10px] text-alabaster uppercase">Profit</p>
              <p className="font-bold text-green-400">{formatCurrency(totalProfit, lang)}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-2 text-center backdrop-blur-sm border border-white/10">
              <p className="text-[10px] text-alabaster uppercase">Expense</p>
              <p className="font-bold text-red-400">{formatCurrency(totalExpense, lang)}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-2 text-center backdrop-blur-sm border border-white/10">
              <p className="text-[10px] text-alabaster uppercase">Net</p>
              <p className={`font-bold ${netProfit >= 0 ? 'text-orange' : 'text-red-400'}`}>{formatCurrency(netProfit, lang)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase text-prussian/60">{t('ledger.title')}</span>
            <Wallet className="text-prussian/20" size={18} />
          </div>
          <p className={`text-2xl font-bold ${totalDebt > 0 ? 'text-red-500' : 'text-prussian'}`}>
            {formatCurrency(totalDebt, lang)}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase text-prussian/60">Low Stock</span>
            <Package className={lowStockCount > 0 ? 'text-orange' : 'text-prussian/20'} size={18} />
          </div>
          <p className={`text-2xl font-bold ${lowStockCount > 0 ? 'text-orange' : 'text-prussian'}`}>
            {lowStockCount} <span className="text-xs font-normal">items</span>
          </p>
        </div>
      </div>

      {/* Profit Insights */}
      {profitInsights && (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-prussian mb-4 flex items-center gap-2">
            <TrendingUp className="text-orange" size={18} /> Profit Insights
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-prussian/50 mb-2 uppercase">Top Performers (30d)</p>
              <div className="space-y-2">
                {profitInsights.top5.slice(0, 3).map((p, i) => (
                  <div key={i} className="flex justify-between text-xs items-center">
                    <span className="truncate w-24 font-medium text-prussian">{p.name}</span>
                    <span className="font-bold text-green-600">{formatCurrency(p.totalProfit, lang)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-prussian/50 mb-2 uppercase">Needs Attention</p>
              <div className="space-y-2">
                {profitInsights.bottom5.slice(0, 3).map((p, i) => (
                  <div key={i} className="flex justify-between text-xs items-center">
                    <span className="truncate w-24 font-medium text-prussian">{p.name}</span>
                    <span className="font-bold text-orange">{formatCurrency(p.totalProfit, lang)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Analysis */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-prussian mb-4">Monthly Analysis</h3>
        <div className="space-y-2 mb-4">
           <div className="flex justify-between items-center">
             <span className="text-sm text-prussian/60">Total Sales</span>
             <span className="font-bold text-prussian">{formatCurrency(totalSalesMonth, lang)}</span>
           </div>
           <div className="flex justify-between items-center">
             <span className="text-sm text-prussian/60">Inventory Cost</span>
             <span className="font-bold text-prussian">{formatCurrency(totalInventoryExpenseMonth, lang)}</span>
           </div>
           <div className="flex justify-between items-center">
             <span className="text-sm text-prussian/60">Op. Expenses</span>
             <span className="font-bold text-prussian">{formatCurrency(totalGeneralExpenseMonth, lang)}</span>
           </div>
        </div>
        <div className={`p-4 rounded-xl ${netMonthlyProfit >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
          <p className={`text-xs font-bold mb-1 uppercase ${netMonthlyProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>Net Monthly Profit</p>
          <p className={`text-2xl font-bold ${netMonthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(netMonthlyProfit, lang)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-prussian mb-4">Weekly Trend</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={20}>
              <XAxis dataKey="date" tick={{fontSize: 10, fill: '#14213D'}} axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: '#E5E5E5'}} contentStyle={{borderRadius: '12px', border: 'none', backgroundColor: '#FFFFFF', color: '#14213D', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
              <Bar dataKey="sales" fill="#FCA311" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stock Prediction */}
      {stockPredictions && stockPredictions.length > 0 && (
         <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-prussian mb-4 flex items-center gap-2">
               <AlertTriangle className="text-orange" size={18} /> Stock Prediction
            </h3>
            <div className="space-y-2">
               {stockPredictions.filter(p => p.daysLeft < 999).sort((a,b) => a.daysLeft - b.daysLeft).slice(0, 3).map(p => (
                  <div key={p.id} className="flex justify-between items-center p-2 rounded-lg bg-alabaster">
                     <span className="font-bold text-sm text-prussian">{p.name}</span>
                     <span className={`text-xs font-bold ${p.daysLeft < 3 ? 'text-red-600' : 'text-orange'}`}>
                        {p.daysLeft} Days Left
                     </span>
                  </div>
               ))}
            </div>
         </div>
      )}

      {/* Recent Sales */}
      <div>
        <h3 className="font-bold text-prussian mb-4">{t('dashboard.recentSales')}</h3>
        <div className="space-y-3">
          {recentSales.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-2xl border border-gray-100">
              <ShoppingCart className="mx-auto text-prussian/20 mb-3" size={48} />
              <p className="text-prussian/50 font-medium">No transactions today</p>
            </div>
          ) : (
            recentSales.map((sale, i) => (
              <div key={sale.id} className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center border border-gray-100 stagger-item" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-alabaster rounded-lg text-prussian"><ShoppingCart size={18}/></div>
                  <div>
                    <p className="font-bold text-prussian">{sale.productName}</p>
                    <p className="text-[10px] text-prussian/50">{formatDate(sale.date, lang)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-prussian">{formatCurrency(sale.total, lang)}</p>
                  <p className="text-[10px] font-bold text-green-600">+{formatCurrency(sale.profit, lang)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const DashboardSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex items-center gap-3 mb-8">
      <div className="w-12 h-12 bg-alabaster rounded-xl" />
      <div className="space-y-2 flex-1">
        <div className="h-4 w-24 bg-alabaster rounded" />
        <div className="h-3 w-32 bg-alabaster rounded" />
      </div>
    </div>
    <div className="h-48 w-full bg-alabaster rounded-3xl" />
    <div className="grid grid-cols-2 gap-4">
      <div className="h-24 bg-alabaster rounded-2xl" />
      <div className="h-24 bg-alabaster rounded-2xl" />
    </div>
  </div>
);

export default Dashboard;
