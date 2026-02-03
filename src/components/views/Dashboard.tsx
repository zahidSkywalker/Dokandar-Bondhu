import React from 'react';
import { ArrowUpRight, ArrowDownRight, Package, TrendingUp, Wallet } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency, formatDate } from '../../lib/utils';

const Dashboard: React.FC = () => {
  const { t, lang } = useLanguage();
  const { 
    totalSales, 
    totalProfit, 
    totalExpense, 
    netProfit, 
    lowStockCount, 
    recentSales, 
    isLoading, 
    chartData 
  } = useDashboardStats();

  if (isLoading) return <div className="p-4 text-center text-earth-600">{t('common.loading')}</div>;

  return (
    <div className="space-y-6 pb-24 max-w-2xl mx-auto">
      
      {/* Greeting */}
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-earth-900">Good {new Date().getHours() < 12 ? 'Morning' : 'Evening'}</h2>
        <p className="text-sm text-earth-600">Here's your business overview</p>
      </div>

      {/* Main Stats Card - Gradient */}
      <div className="glass-card bg-gradient-to-br from-earth-600 to-earth-800 rounded-3xl p-6 text-white shadow-xl shadow-earth-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Wallet size={120} />
        </div>
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

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
             <span className="text-xs font-bold text-earth-500 uppercase tracking-wider">Net Worth</span>
             <TrendingUp className="text-earth-400" size={18} />
          </div>
          <p className={`text-xl font-bold ${netProfit >= 0 ? 'text-earth-800' : 'text-red-600'}`}>
            {formatCurrency(netProfit, lang)}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-sm relative overflow-hidden">
          {lowStockCount > 0 && (
            <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full m-3 animate-pulse" />
          )}
          <div className="flex items-center justify-between mb-2">
             <span className="text-xs font-bold text-earth-500 uppercase tracking-wider">Low Stock</span>
             <Package className={lowStockCount > 0 ? 'text-red-500' : 'text-earth-400'} size={18} />
          </div>
          <p className={`text-xl font-bold ${lowStockCount > 0 ? 'text-red-600' : 'text-earth-800'}`}>
            {lowStockCount} <span className="text-xs font-normal text-earth-400">items</span>
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-earth-900">Weekly Trend</h3>
          <span className="text-[10px] bg-cream-100 px-2 py-1 rounded-md text-earth-600 font-bold uppercase">7 Days</span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={20}>
              <XAxis 
                dataKey="date" 
                tick={{fontSize: 10, fill: '#8B5E3C'}} 
                axisLine={false} 
                tickLine={false} 
              />
              <Tooltip 
                cursor={{fill: '#F5F2EB'}}
                contentStyle={{borderRadius: '12px', border: '1px solid #E6E0D6', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}
                formatter={(value: number) => [formatCurrency(value, lang), 'Sales']}
              />
              <Bar dataKey="sales" fill="#8B5E3C" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Sales List */}
      <div>
        <h3 className="font-bold text-earth-900 mb-4 px-1 flex justify-between items-center">
          {t('dashboard.recentSales')}
        </h3>
        <div className="space-y-3">
          {recentSales.length === 0 ? (
             <div className="p-10 text-center bg-white rounded-2xl border border-cream-200">
               <p className="text-earth-400 font-medium">No transactions today</p>
             </div>
          ) : (
            recentSales.map((sale) => (
              <div key={sale.id} className="bg-white p-4 rounded-2xl border border-cream-200 shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-bold text-earth-900">{sale.productName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-cream-100 text-earth-600 text-[10px] px-2 py-0.5 rounded font-bold">{sale.quantity} pcs</span>
                    <span className="text-[10px] text-earth-400">{formatDate(sale.date, lang)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-earth-900">{formatCurrency(sale.total, lang)}</p>
                  <p className="text-[10px] text-green-600 font-medium">+{formatCurrency(sale.profit, lang)}</p>
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
