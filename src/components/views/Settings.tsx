import React, { useRef } from 'react';
import { Download, Upload, FileSpreadsheet, Shield, Moon, Sun, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { exportToCSV, backupDatabase, restoreDatabase } from '../../lib/utils';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';

const Settings: React.FC = () => {
  const { t, lang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sales = useLiveQuery(() => db.sales.toArray());
  const products = useLiveQuery(() => db.products.toArray());

  const handleExportCSV = async () => {
    if (sales) await exportToCSV(sales, 'monthly_sales_report');
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

  return (
    <div className="pb-24 max-w-2xl mx-auto space-y-6">
      <h1 className={`text-2xl font-bold mt-4 ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>Settings</h1>

      {/* Appearance */}
      <div className={`p-5 rounded-2xl border shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
        <h2 className={`font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>Appearance</h2>
        <button 
          onClick={toggleTheme}
          className="w-full flex justify-between items-center p-3 rounded-xl bg-cream-50 dark:bg-gray-700"
        >
          <div className="flex items-center gap-3">
             {theme === 'dark' ? <Sun className="text-yellow-400" size={20} /> : <Moon className="text-earth-600" size={20} />}
             <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-earth-800'}`}>Dark Mode</span>
          </div>
          <div className={`w-12 h-6 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-earth-600' : 'bg-gray-300'}`}>
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
          </div>
        </button>
      </div>

      {/* Data Management */}
      <div className={`p-5 rounded-2xl border shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
        <h2 className={`font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>Data Management</h2>
        
        <button onClick={handleExportCSV} className="w-full flex items-center gap-3 p-4 mb-3 rounded-xl border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:border-gray-600">
          <div className="p-2 bg-green-100 text-green-600 rounded-lg"><FileSpreadsheet size={20} /></div>
          <div className="text-left">
            <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-800'}`}>Export Monthly Report</p>
            <p className="text-xs text-earth-500 dark:text-gray-400">Download Sales as CSV (Excel)</p>
          </div>
        </button>

        <button onClick={backupDatabase} className="w-full flex items-center gap-3 p-4 mb-3 rounded-xl border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:border-gray-600">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Download size={20} /></div>
          <div className="text-left">
            <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-800'}`}>Backup Data</p>
            <p className="text-xs text-earth-500 dark:text-gray-400">Save full database as JSON</p>
          </div>
        </button>

        <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-3 p-4 rounded-xl border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:border-gray-600">
          <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Upload size={20} /></div>
          <div className="text-left">
            <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-800'}`}>Restore Data</p>
            <p className="text-xs text-earth-500 dark:text-gray-400">Load backup from file</p>
          </div>
        </button>
        <input type="file" ref={fileInputRef} onChange={handleRestore} className="hidden" accept=".json" />
      </div>

      {/* Danger Zone */}
      <div className={`p-5 rounded-2xl border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900`}>
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
