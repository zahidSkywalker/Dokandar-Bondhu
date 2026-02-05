import React from 'react';
import { TrendingUp, TrendingDown, Award, AlertCircle } from 'lucide-react';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency } from '../../lib/utils';

// Reusable Card Component
const InsightCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; type?: 'success' | 'warning' }> = ({ title, icon, children, type = 'success' }) => {
  return (
    <div className={`p-5 rounded-2xl border shadow-sm ${type === 'warning' ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900' : 'bg-white dark:bg-gray-800 border-cream-200 dark:border-gray-700'}`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full ${type === 'warning' ? 'bg-orange-100 dark:bg-orange-900/20' : 'bg-earth-50 dark:bg-earth-900/20'}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h4 className={`font-bold text-base ${type === 'warning' ? 'text-orange-700 dark:text-orange-300' : 'text-earth-700 dark:text-earth-200'}`}>
            {title}
          </h4>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfitInsights: React.FC = () => {
  const { t, lang } = useLanguage();
  const { theme } = useTheme();
  const stats = useDashboardStats(7); // Analyze last 7 days
  const analysis = analyzeProfitability ? stats.analyzeProfitability() : { topProducts: [], bottomProducts: [], trendAnalysis: { topGainerId: null, topLoserId: null, isProfitUp: true } };

  return (
    <div className="pb-24 max-w-2xl mx-auto animate-fade-in space-y-6">
      <h1 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>
        Profit Insights
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top 5 Performers */}
        <div>
          <h2 className={`text-lg font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>
            Top 5 Performers
          </h2>
          <div className="space-y-3">
            {analysis.topProducts.length === 0 ? (
              <div className="p-4 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-xl border border-cream-200 dark:border-gray-700">
                Not enough data to analyze.
              </div>
            ) : (
              analysis.topProducts.map((item, index) => (
                <div key={item.productId} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-cream-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`font-bold text-lg ${index < 3 ? 'text-yellow-600' : (index === 4 ? 'text-gray-400' : 'text-earth-600')}`}>
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-bold text-base text-earth-900 dark:text-white">
                        {item.productName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Sold: {item.quantity} | Profit: {formatCurrency(item.totalProfit, lang)}
                      </div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-earth-800 dark:text-yellow-400">
                    {formatCurrency(item.totalProfit, lang)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bottom 5 Performers */}
        <div>
          <h2 className={`text-lg font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>
            Attention Required
          </h2>
          <div className="space-y-3">
            {analysis.bottomProducts.length === 0 ? (
              <div className="p-4 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-xl border border-cream-200 dark:border-gray-700">
                Not enough data to analyze.
              </div>
            ) : (
              analysis.bottomProducts.map((item, index) => (
                <div key={item.productId} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-900">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                      <AlertCircle size={20} className="text-orange-600 dark:text-orange-300" />
                    </div>
                    <div>
                      <div className="font-bold text-base text-orange-700 dark:text-orange-200">
                        {item.productName}
                      </div>
                      <div className="text-xs text-orange-600 dark:text-orange-300">
                        Sold: {item.quantity} | Profit: {formatCurrency(item.totalProfit, lang)}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-bold uppercase text-orange-700">
                    Low Margin
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      {/* Overall Trend */}
        <InsightCard
          title="Profit Trend"
          icon={<TrendingUp size={24} className={analysis.trendAnalysis.isProfitUp ? 'text-green-500' : 'text-red-500'} />}
          type={analysis.trendAnalysis.isProfitUp ? 'success' : 'warning'}
        >
          Profit is <span className="font-bold">{analysis.trendAnalysis.isProfitUp ? 'UP' : 'DOWN'}</span> compared to last week.
        </InsightCard>

      {/* Actionable Insights */}
        <InsightCard
          title="Best Seller"
          icon={<Award size={24} className="text-earth-600" />}
        >
          <div className="text-gray-600 dark:text-gray-400">
            {analysis.topProducts.length > 0 ? analysis.topProducts[0].productName : "N/A"} is your most profitable item.
          </div>
        </InsightCard>
    </div>
  );
};

export default ProfitInsights;
