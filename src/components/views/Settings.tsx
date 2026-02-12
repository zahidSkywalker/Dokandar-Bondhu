import React, { useRef } from 'react';
import { Download, Upload, FileSpreadsheet, Shield, Moon, Sun, Monitor, Palette, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme, ACCENT_COLORS } from '../../context/ThemeContext';
import { exportToCSV, backupDatabase, restoreDatabase } from '../../lib/utils';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';

const Settings: React.FC = () => {
  const { t, lang } = useLanguage();
  const { mode, theme, accent, setMode, setAccent } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const sales = useLiveQuery(() => db.sales.toArray());

  const handleExportCSV = async () => {
    if (sales) await exportToCSV(sales, 'dokandar_sales_report');
  };

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const confirm = window.confirm("This will replace ALL current data. Are you sure?");
      if (confirm) {
        await restoreDatabase(e.target.files[0]);
        alert("Database restored successfully!");
        window.location.reload();
      }
    }
  };

  const themeOptions = [
    { key: 'light', label: 'Light', icon: Sun },
    { key: 'dark', label: 'Dark', icon: Moon },
    { key: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div className="pb-24 max-w-2xl mx-auto space-y-8">
      <h1 className={`text-2xl font-bold mt-4 ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>Settings</h1>

      {/* Appearance Section */}
      <div className={`p-6 rounded-3xl border shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
        <h2 className={`font-bold mb-6 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>
          <Palette size={18} /> Appearance
        </h2>

        {/* Theme Selector Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {themeOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setMode(opt.key as 'light' | 'dark' | 'system')}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                mode === opt.key 
                  ? 'bg-primary/10 border-primary shadow-md' 
                  : theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                    : 'bg-cream-50 border-cream-200 hover:bg-cream-100'
              }`}
            >
              <opt.icon className={mode === opt.key ? 'text-primary' : (theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} size={24} />
              <span className={`text-xs mt-2 font-bold ${mode === opt.key ? 'text-primary' : (theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}`}>
                {opt.label}
              </span>
            </button>
          ))}
        </div>

        {/* Accent Color Picker */}
        <label className={`block text-sm font-medium mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Brand Color
        </label>
        <div className="flex gap-3 flex-wrap">
          {Object.entries(ACCENT_COLORS).map(([key, color]) => (
            <button
              key={key}
              onClick={() => setAccent(key as any)}
              style={{ backgroundColor: color.value }}
              className={`w-10 h-10 rounded-full shadow-inner transition-transform ${accent === key ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 scale-110' : 'opacity-80 hover:opacity-100'}`}
            >
              {accent === key && <Check className="text-white mx-auto" size={20} />}
            </button>
          ))}
        </div>
      </div>

      {/* Data Management */}
      <div className={`p-6 rounded-3xl border shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
        <h2 className={`font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>Data Management</h2>
        
        <button onClick={handleExportCSV} className="w-full flex items-center gap-3 p-4 mb-3 rounded-2xl border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:border-gray-600">
          <div className="p-2 bg-green-100 text-green-600 rounded-xl"><FileSpreadsheet size={20} /></div>
          <div className="text-left">
            <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-800'}`}>Export Report</p>
            <p className="text-xs text-earth-500 dark:text-gray-400">Download Sales as CSV</p>
          </div>
        </button>

        <button onClick={backupDatabase} className="w-full flex items-center gap-3 p-4 mb-3 rounded-2xl border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:border-gray-600">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><Download size={20} /></div>
          <div className="text-left">
            <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-800'}`}>Backup Data</p>
            <p className="text-xs text-earth-500 dark:text-gray-400">Save full database</p>
          </div>
        </button>

        <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-3 p-4 rounded-2xl border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:border-gray-600">
          <div className="p-2 bg-orange-100 text-orange-600 rounded-xl"><Upload size={20} /></div>
          <div className="text-left">
            <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-800'}`}>Restore Data</p>
            <p className="text-xs text-earth-500 dark:text-gray-400">Load backup file</p>
          </div>
        </button>
        <input type="file" ref={fileInputRef} onChange={handleRestore} className="hidden" accept=".json" />
      </div>

      {/* Danger Zone */}
      <div className={`p-6 rounded-3xl border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900`}>
        <h2 className="font-bold text-red-700 dark:text-red-400 mb-4 flex items-center gap-2">
          <Shield size={16} /> Danger Zone
        </h2>
        <button onClick={() => { if(confirm("Clear all data?")) { db.delete(); window.location.reload(); } }} className="w-full py-3 rounded-xl bg-red-500 text-white font-bold shadow-lg shadow-red-500/30">
          Delete All Data
        </button>
      </div>
    </div>
  );
};

export default Settings;
