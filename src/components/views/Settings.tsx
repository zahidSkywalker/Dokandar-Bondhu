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
      <h1 className={`text-2xl font-bold mt-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Settings</h1>

      {/* Appearance */}
      <div className={`
        p-5 rounded-2xl border shadow-sm
        ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}
      `}>
        <h2 className={`font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
           <Moon size={18} className="text-slate-400"/> Appearance
        </h2>
        <button 
          onClick={toggleTheme}
          className="w-full flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
        >
          <div className="flex items-center gap-3">
             <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700 text-amber-400' : 'bg-slate-200 text-slate-600'}`}>
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
             </div>
             <span className={`font-medium text-sm ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>Dark Mode</span>
          </div>
          <div className={`w-11 h-6 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-primary-600' : 'bg-slate-300'}`}>
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`} />
          </div>
        </button>
      </div>

      {/* Data Management */}
      <div className={`
        p-5 rounded-2xl border shadow-sm
        ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}
      `}>
        <h2 className={`font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
           <FileSpreadsheet size={18} className="text-primary-500"/> Data Management
        </h2>
        
        <button onClick={handleExportCSV} className="w-full flex items-center gap-4 p-4 mb-3 rounded-xl border hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors dark:border-slate-700 border-slate-100 group">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-xl group-hover:scale-110 transition-transform"><FileSpreadsheet size={20} /></div>
          <div className="text-left flex-1">
            <p className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Export Monthly Report</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Download Sales as CSV</p>
          </div>
        </button>

        <button onClick={backupDatabase} className="w-full flex items-center gap-4 p-4 mb-3 rounded-xl border hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors dark:border-slate-700 border-slate-100 group">
          <div className="p-2.5 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-xl group-hover:scale-110 transition-transform"><Download size={20} /></div>
          <div className="text-left flex-1">
            <p className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Backup Data</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Save full database as JSON</p>
          </div>
        </button>

        <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-4 p-4 rounded-xl border hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors dark:border-slate-700 border-slate-100 group">
          <div className="p-2.5 bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 rounded-xl group-hover:scale-110 transition-transform"><Upload size={20} /></div>
          <div className="text-left flex-1">
            <p className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Restore Data</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Load backup from file</p>
          </div>
        </button>
        <input type="file" ref={fileInputRef} onChange={handleRestore} className="hidden" accept=".json" />
      </div>

      {/* Danger Zone */}
      <div className={`
        p-5 rounded-2xl border bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30
      `}>
        <h2 className="font-bold text-red-700 dark:text-red-400 mb-4 flex items-center gap-2">
          <Shield size={16} /> Danger Zone
        </h2>
        <button onClick={() => { if(confirm("Are you absolutely sure? This action cannot be undone.")) { db.delete(); window.location.reload(); } }} className="w-full py-3.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg shadow-red-500/20 transition-colors">
          Delete All Data
        </button>
        <p className={`text-[10px] mt-3 ${theme === 'dark' ? 'text-red-400/70' : 'text-red-500/80'}`}>
          This will permanently delete all products, sales, customers, and settings.
        </p>
      </div>
      
      <div className="h-8" />
    </div>
  );
};

export default Settings;
