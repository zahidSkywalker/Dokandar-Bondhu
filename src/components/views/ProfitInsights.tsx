import React from 'react';
import { TrendingUp, TrendingDown, Award, AlertCircle } from 'lucide-react';
import { useDashboardStats } from '../../hooks/useDashboardStats'; // Updated hook with extended return types
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext'; // Import context to trigger notifications

// Report Types (Imported from types)
import { DailyReportPayload, MonthlyReportPayload } from '../../types';

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
          <div className={`text-sm ${type === 'warning' ? 'text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400'}`}>
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
  const { triggerNotification } = useApp(); // Get trigger from context
  const stats = useDashboardStats(7); // Use extended hook

  // Action Handlers for Reports
  const handleGenerateDailyReport = async () => {
    await triggerNotification('daily-report', {}); // Payload handled by hook logic
  };

  const handleGenerateMonthlyReport = async () => {
    await triggerNotification('monthly-report', {}); // Payload handled by hook logic
  };

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
            {stats.topProducts.length === 0 ? (
              <div className={`p-4 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-xl border border-cream-200 dark:border-gray-700`}>
                <p>Not enough data to analyze.</p>
              </div>
            ) : (
              stats.topProducts.map((item, index) => (
                <InsightCard
                  key={item.productId}
                  title={`#${index + 1} ${item.productName}`}
                  icon={<Award size={24} className={index < 3 ? 'text-yellow-600' : 'text-earth-600'} />}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>
                        {item.productName}
                      </h4>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Sold: {item.quantity} | Profit: {stats.formatCurrency(item.totalProfit, lang)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-bold ${item.totalProfit > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                        {stats.formatCurrency(item.totalProfit, lang)}
                      </div>
                    </div>
                  </div>
                </InsightCard>
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
            {stats.bottomProducts.length === 0 ? (
              <div className={`p-4 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-xl border border-cream-200 dark:border-gray-700`}>
                <p>Not enough data to analyze.</p>
              </div>
            ) : (
              stats.bottomProducts.map((item, index) => (
                <InsightCard
                  key={item.productId}
                  title={`#${index + 1} ${item.productName}`}
                  type="warning"
                  icon={<AlertCircle size={24} className="text-orange-600" />}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>
                        {item.productName}
                      </h4>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Sold: {item.quantity} | Profit: {stats.formatCurrency(item.totalProfit, lang)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold uppercase text-orange-700">
                        Low Margin
                      </div>
                      <div className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-orange-700'}`}>
                        {stats.formatCurrency(item.totalProfit, lang)}
                      </div>
                    </div>
                  </div>
                </InsightCard>
              ))
            )}
          </div>
        </div>

        {/* Overall Trend */}
        <InsightCard
          title="Profit Trend"
          icon={<TrendingUp size={24} className={stats.trendAnalysis.isProfitUp ? 'text-green-500' : 'text-red-500'} />}
          type={stats.trendAnalysis.isProfitUp ? 'success' : 'warning'}
        >
          Profit is <span className="font-bold">{stats.trendAnalysis.isProfitUp ? 'UP' : 'DOWN'}</span> compared to last week.
        </InsightCard>

        {/* Actionable Insights */}
        <InsightCard
          title="Best Seller"
          icon={<Award size={24} className="text-earth-600" />}
        >
          <div className="text-gray-600 dark:text-gray-400">
            {stats.topProducts.length > 0 ? stats.topProducts[0].productName : "N/A"} is your most profitable item.
          </div>
        </InsightCard>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={handleGenerateDailyReport}
          className="p-4 rounded-xl border bg-earth-50 dark:bg-earth-900/20 text-earth-900 dark:text-white font-bold shadow-sm hover:bg-earth-100 dark:hover:bg-earth-800 transition-all"
        >
          Generate Daily Report
        </button>
        <button 
          onClick={handleGenerateMonthlyReport}
          class_name="p-4 rounded-xl border bg-earth-50 dark:bg-earth-900/20 text-earth-900 dark:text-white font-bold shadow-sm hover:bg-earth-100 dark:hover:bg-earth-800 transition-all"
        >
          Generate Monthly Report
        </button>
      </div>
    </div>
  );
};

export default ProfitInsights;
