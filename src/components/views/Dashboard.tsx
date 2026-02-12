import React from 'react';
import { TrendingUp, Package, Wallet, ShoppingCart, TrendingDown, Sun, CloudSun, Moon } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import { formatCurrency, formatDate } from '../../lib/utils';

const Dashboard: React.FC = () => {
  const { t, lang } = useLanguage();
  const { businessName } = useSettings();
  const { 
    totalSales, totalProfit, totalExpense, netProfit, lowStockCount, 
    recentSales, isLoading, chartData, totalDebt, 
    salesGrowth
  } = useDashboardStats();

  const getGreetingData = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good Morning", Icon: Sun };
    if (hour < 17) return { text: "Good Afternoon", Icon: CloudSun };
    return { text: "Good Evening", Icon: Moon };
  };
  const { text: greetingText, Icon: GreetingIcon } = getGreetingData();

  if (isLoading) return <div className="p-4 text-center text-prussian">Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-prussian rounded-lg text-orange">
            <GreetingIcon size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-prussian font-display">{greetingText},</h2>
            <p className="text-sm font-semibold text-black/70">{businessName}</p>
          </div>
        </div>
        {salesGrowth !== 0 && (
          <div className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${
            salesGrowth > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {salesGrowth > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(salesGrowth).toFixed(1)}%
          </div>
        )}
      </div>

      {/* Hero Card - Prussian Blue */}
      <div className="bg-prussian rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
            <Wallet size={120} className="text-white" />
        </div>
        <div className="relative z-10">
          <p className="text-alabaster text-xs font-bold uppercase tracking-wider">{t('dashboard.todaySales')}</p>
          <h2 className="text-4xl font-bold tracking-tight my-2 font-display">{formatCurrency(totalSales, lang)}</h2>
          
          <div className="grid grid-cols-3 gap-2 mt-6">
            <div className="bg-white/10 rounded-xl p-2 text-center">
              <p className="text-[10px] text-alabaster uppercase">Profit</p>
              <p className="font-bold text-green-400">{formatCurrency(totalProfit, lang)}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-2 text-center">
              <p className="text-[10px] text-alabaster uppercase">Expense</p>
              <p className="font-bold text-red-400">{formatCurrency(totalExpense, lang)}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-2 text-center">
              <p className="text-[10px] text-alabaster uppercase">Net</p>
              <p className={`font-bold ${netProfit >= 0 ? 'text-orange' : 'text-red-400'}`}>{formatCurrency(netProfit, lang)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase text-prussian/60">{t('ledger.title')}</span>
            <Wallet className="text-prussian/30" size={18} />
          </div>
          <p className={`text-2xl font-bold ${totalDebt > 0 ? 'text-red-500' : 'text-prussian'}`}>
            {formatCurrency(totalDebt, lang)}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase text-prussian/60">Low Stock</span>
            <Package className={lowStockCount > 0 ? 'text-orange' : 'text-prussian/30'} size={18} />
          </div>
          <p className={`text-2xl font-bold ${lowStockCount > 0 ? 'text-orange' : 'text-prussian'}`}>
            {lowStockCount} <span className="text-xs font-normal">items</span>
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
              <Tooltip cursor={{fill: '#E5E5E5'}} contentStyle={{borderRadius: '12px', border: 'none', backgroundColor: '#FFFFFF', color: '#14213D'}} />
              <Bar dataKey="sales" fill="#FCA311" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

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
            recentSales.map((sale) => (
              <div key={sale.id} className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-alabaster rounded-lg text-prussian">
                    <ShoppingCart size={18}/>
                  </div>
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

export default Dashboard;
