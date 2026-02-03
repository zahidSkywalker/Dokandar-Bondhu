import React from 'react';
import { ArrowUpRight, ArrowDownRight, Package, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency, formatDate } from '../../lib/utils';
import { subDays, format } from 'date-fns';

const Dashboard: React.FC = () => {
  const { t, lang } = useLanguage();
  const { totalSales, totalProfit, totalExpense, netProfit, lowStockCount, recentSales, isLoading } = useDashboardStats();

  // Generate dummy chart data for last 7 days (In a real app, aggregate from DB)
  // For production grade, we would hook this up to actual DB aggregation
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    return {
      date: lang === 'bn' ? format(d, 'EEE') : format(d, 'EEE'),
      sales: 0 // In full implementation, query db.sales.where('date').between(...)
    };
  });

  if (isLoading) return <div className="p-4 text-center text-gray-500">{t('common.loading')}</div>;

  return (
    <div className="pb-24 px-4 pt-6 space-y-6 max-w-2xl mx-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">{t('dashboard.title')}</h1>
        <span className="text-sm text-gray-500">{formatDate(new Date(), lang)}</span>
      </div>

      {/* Main Stats Card */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 bg-gradient-to-r from-teal-600 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-teal-100 text-sm font-medium mb-1">{t('dashboard.todaySales')}</p>
          <h2 className="text-3xl font-bold">{formatCurrency(totalSales, lang)}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-green-100 rounded-md text-green-600"><ArrowUpRight size={16} /></div>
            <span className="text-xs text-gray-500">{t('dashboard.todayProfit')}</span>
          </div>
          <p className="text-xl font-bold text-gray-800">{formatCurrency(totalProfit, lang)}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-red-100 rounded-md text-red-600"><ArrowDownRight size={16} /></div>
            <span className="text-xs text-gray-500">{t('dashboard.todayExpense')}</span>
          </div>
          <p className="text-xl font-bold text-gray-800">{formatCurrency(totalExpense, lang)}</p>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockCount > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-full text-orange-600">
            <Package size={20} />
          </div>
          <div>
            <p className="font-semibold text-orange-800 text-sm">{t('dashboard.stockAlert')}</p>
            <p className="text-xs text-orange-600">{lowStockCount} items are running low</p>
          </div>
        </div>
      )}

      {/* Chart Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 text-sm">Weekly Trend</h3>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="date" tick={{fontSize: 10, fill: '#9ca3af'}} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
              />
              <Bar dataKey="sales" fill="#0d9488" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Sales List */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3 px-1">{t('dashboard.recentSales')}</h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {recentSales.length === 0 ? (
             <div className="p-8 text-center text-gray-400 text-sm">No sales today</div>
          ) : (
            recentSales.map((sale) => (
              <div key={sale.id} className="flex justify-between items-center p-4 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-medium text-gray-800">{sale.productName}</p>
                  <p className="text-xs text-gray-500">{sale.quantity} pcs</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{formatCurrency(sale.total, lang)}</p>
                  <p className="text-xs text-green-600">+{formatCurrency(sale.profit, lang)}</p>
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
