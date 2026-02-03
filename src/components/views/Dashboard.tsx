// ⚠️ SAME IMPORTS AS YOUR FILE (unchanged)
import React from 'react';
import {
  Package,
  Wallet,
  AlertTriangle
} from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency, formatDate } from '../../lib/utils';

const Dashboard: React.FC = () => {
  const { lang } = useLanguage();
  const {
    totalSales,
    totalProfit,
    totalExpense,
    recentSales,
    chartData,
    totalDebt,
    lowStockCount,
    netMonthlyProfit,
    stockPredictions
  } = useDashboardStats();

  return (
    <div className="pb-24 max-w-2xl mx-auto bg-gray-50">
      {/* Recent Sales */}
      <div className="mt-6">
        <h3 className="font-bold text-gray-900 mb-4">Recent Sales</h3>

        <div className="space-y-3">
          {recentSales.length === 0 ? (
            <div className="p-10 text-center rounded-3xl border bg-gray-50">
              <p className="text-gray-400 font-medium">
                No transactions today
              </p>
            </div>
          ) : (
            recentSales.map((sale) => (
              <div
                key={sale.id}
                className="p-4 rounded-2xl border bg-white flex justify-between items-center"
              >
                <div>
                  <p className="font-bold">{sale.productName}</p>
                  <p className="text-xs text-gray-500">
                    {sale.quantity} pcs · {formatDate(sale.date)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold">
                    {formatCurrency(sale.total, lang)}
                  </p>
                  <p className="text-xs text-green-600">
                    +{formatCurrency(sale.profit, lang)}
                  </p>
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
