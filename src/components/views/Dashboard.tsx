import React from 'react';
import { ArrowUpRight, ArrowDownRight, Package, TrendingUp, Wallet, AlertTriangle, ShoppingCart } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency, formatDate } from '../../lib/utils';

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

  return (
    <div className="pb-24 max-w-2xl mx-auto bg-gray-50">
      {/* Greeting */}
      <div className="mb-2 animate-fade-in flex items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{greeting}</h2>
          <p className="text-sm text-gray-500">Here is your business overview</p>
        </div>
      </div>

      {/* Main Stats Card */}
      <div className="bg-white bg-gradient-to-br from-teal-600 to-teal-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Wallet size={120} className="text-teal-100" />
        </div>
        <p className="text-teal-100 text-sm font-medium mb-1">Today's Sales</p>
        <h2 className="text-4xl font-bold tracking-tight mb-4">{formatCurrency(totalSales, lang)}</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 flex flex-col border-white/10 shadow-sm">
            <p className="text-teal-100 text-xs mb-1">Profit</p>
            <p className="font-bold text-green-600 text-2xl">{formatCurrency(totalProfit, lang)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 flex flex-col border-white/10 shadow-sm">
            <p className="text-teal-100 text-xs mb-1">Expense</p>
            <p className="font-bold text-red-300 text-2xl">{formatCurrency(totalExpense, lang)}</p>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900">Monthly Analysis</h3>
          <button className="px-4 py-2 bg-gray-50 text-xs font-bold uppercase text-gray-600 rounded-lg">This Month</button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
           <div>
             <p className="text-xs text-gray-500">Total Sales</p>
             <p className="font-bold text-gray-900 text-xl">{formatCurrency(totalSalesMonth, lang)}</p>
           </div>
           <div>
             <p className="text-xs text-gray-500">Inventory Cost</p>
             <p className="font-bold text-gray-900 text-xl">{formatCurrency(totalInventoryExpenseMonth, lang)}</p>
           </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-green-50 border border-green-200 mb-4">
        <p className="text-xs font-bold text-green-600 uppercase mb-1">Net Monthly Profit</p>
        <p className="text-2xl font-bold text-green-700">{formatCurrency(netMonthlyProfit, lang)}</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <div 
          onClick={() => window.location.hash = '#ledger'}
          className="p-4 rounded-3xl border shadow-sm cursor-pointer hover:opacity-90 bg-white border-gray-100"
        >
          <div className="flex items-center justify-between mb-2">
             <span className="text-xs font-bold uppercase text-gray-500">Total Debt</span>
             <Wallet className="text-teal-400" size={18} />
          </div>
          <p className="text-xl font-bold text-teal-900">{formatCurrency(totalDebt, lang)}</p>
        </div>

        <div 
          className="p-4 rounded-3xl border shadow-sm bg-white border-gray-100"
        >
          <div className="flex items-center justify-between mb-2">
             <span className="text-xs font-bold uppercase text-gray-500">Low Stock</span>
             <Package className={lowStockCount > 0 ? 'text-red-500' : 'text-teal-400'} size={18} />
          </div>
          <p className="text-xl font-bold text-teal-900">{lowStockCount} <span className="text-sm font-normal text-gray-500">items</span></p>
        </div>
      </div>

      {/* Stock Prediction Alert */}
      <div className="p-5 rounded-3xl border shadow-sm bg-white border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="text-yellow-500" size={18} />
          <h3 className="font-bold text-gray-900">Stock Prediction</h3>
        </div>
        
        {!stockPredictions || stockPredictions.length === 0 ? (
           <div className="p-4 text-center text-gray-400">
             <Package size={32} className="mx-auto mb-2 opacity-20" />
             No stock data available.
           </div>
        ) : (
          <div className="space-y-3">
             {stockPredictions
               .filter(p => p.daysLeft < 999)
               .sort((a, b) => a.daysLeft - b.daysLeft)
               .slice(0, 5)
               .map((product) => {
                  const isCritical = product.daysLeft < 3;
                  return (
                    <div key={product.id} className="flex justify-between items-center p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isCritical ? 'text-red-700' : 'text-gray-700'}`}>
                           {product.name}
                        </span>
                        <span className={`text-xs font-bold ${isCritical ? 'text-red-500' : 'text-gray-500'}`}>
                           {product.daysLeft === 999 ? 'No Sales Data' : `${product.daysLeft} Days Left`}
                        </span>
                      </div>
                    </div>
                  );
                })
             }
          </div>
        )}
      </div>

      {/* Charts & Recent List */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border-gray-100">
        <h3 className="font-bold text-gray-900 mb-6">Weekly Trend</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={20}>
              <XAxis dataKey="date" tick={{fontSize: 10, fill: '#8B5E3C'}} axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: '#8B5E3C'}} contentStyle={{borderRadius: '12px', border: '1px solid #E6E0D6', backgroundColor: '#fff', color: '#000'}} formatter={(value: number) => [formatCurrency(value, lang), 'Sales']} />
              <Bar dataKey="sales" fill="#8B5E3C" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-gray-900 mb-4">Recent Sales</h3>
        <div className="space-y-3">
          {recentSales.length === 0 ? (
             <div className="p-10 text-center rounded-3xl border border-gray-100 bg-gray-50">
               <p className="text-gray-400 font-medium">No transactions today</p>
             </div>
          ) : (
            recentSales.map((sale) => (
              <div key={sale.id} className="p-4 rounded-2xl border shadow-sm bg-white border-gray-100 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-900">{sale.productName}</p>
                  <div className="text-xs text-gray-500 mt-1">
                    {sale.quantity} pcs
                    <span className="text-gray-400">{formatDate(sale.date)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatCurrency(sale.total, lang)}</p>
                  <p className="text-xs text-green-600 font-medium">+{formatCurrency(sale.profit, lang)}</p>
                </div>
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
