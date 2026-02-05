import React from 'react';
import { Bell, BellOff, CheckCircle, X } from 'lucide-react';
import { usePushNotifications } from '../../hooks/usePushNotifications';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const Notifications: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { state, triggerTestNotification } = usePushNotifications();

  const requestPermission = async () => {
    if (state.permission === 'denied') {
      alert("Notifications are blocked in browser settings.");
    } else {
      triggerTestNotification();
    }
  };

  return (
    <div className="pb-24 max-w-2xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6 mt-2">
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>
          Notifications
        </h1>
        <button 
          onClick={requestPermission}
          className={`p-2 rounded-full transition-colors ${
            state.permission === 'granted' 
              ? 'bg-green-500 text-white shadow-lg' 
              : 'bg-gray-300 text-gray-700'
          }`}
        >
          {state.permission === 'granted' ? <Bell size={24} /> : <BellOff size={24} />}
        </button>
      </div>

      {/* Permission Status */}
      <div className={`p-6 rounded-2xl text-center border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
        <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>
          Status
        </h3>
        <div className="flex items-center justify-center gap-2">
          <div className={`w-3 h-3 rounded-full ${state.permission === 'granted' ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className={`text-sm font-bold ml-2 ${state.permission === 'granted' ? 'text-green-700' : 'text-red-700'}`}>
            {state.permission === 'granted' ? 'Active' : 'Denied'}
          </span>
        </div>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
          {state.permission === 'granted' ? 'Notifications are enabled.' : 'Notifications are blocked in browser settings.'}
        </p>
      </div>

      <div className={`p-6 rounded-2xl text-center border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
        <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>
          Alerts
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Notifications allow us to alert you about low stock and daily summaries even when app is closed.
        </p>
        <button 
          onClick={triggerTestNotification}
          disabled={state.permission !== 'granted'}
          className={`w-full bg-cream-100 text-earth-800 py-3 rounded-xl font-bold border border-cream-200 shadow-sm active:scale-95 ${
            state.permission !== 'granted' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-earth-50'
          }`}
        >
          Send Test Notification
        </button>
      </div>
    </div>
  );
};

export default Notifications;
