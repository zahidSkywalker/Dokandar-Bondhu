import React, { useState, useEffect, useRef } from 'react';
import { Download, Upload, FileSpreadsheet, Shield, Save, Edit3, Trash2, Crown, Clock, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import { exportToCSV, backupDatabase, restoreDatabase } from '../../lib/utils';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { getLicenseStatus, validateAndActivate } from '../../lib/license';

const Settings: React.FC = () => {
  const { t } = useLanguage();
  const { businessName, setBusinessName } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [tempName, setTempName] = React.useState(businessName);
  const sales = useLiveQuery(() => db.sales.toArray());

  // --- LICENSE STATE ---
  const [licenseStatus, setLicenseStatus] = useState<{ status: 'active' | 'trial' | 'expired', daysLeft: number }>({ status: 'trial', daysLeft: 7 });
  const [licenseKey, setLicenseKey] = useState('');
  const [licenseError, setLicenseError] = useState('');
  const [licenseSuccess, setLicenseSuccess] = useState(false);

  useEffect(() => {
    setLicenseStatus(getLicenseStatus());
  }, []);

  const handleSaveName = () => {
    setBusinessName(tempName);
    alert("Business name saved!");
  };

  const handleExportCSV = async () => {
    if (sales) await exportToCSV(sales, 'dokandar_sales_report');
  };

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (confirm("This will replace ALL current data. Are you sure?")) {
        await restoreDatabase(e.target.files[0]);
        alert("Database restored successfully!");
        window.location.reload();
      }
    }
  };

  const handleActivation = () => {
    const result = validateAndActivate(licenseKey);
    if (result.success) {
      setLicenseSuccess(true);
      setLicenseError('');
      setLicenseStatus(getLicenseStatus()); // Refresh status
      setTimeout(() => window.location.reload(), 1500); // Reload to reflect changes everywhere
    } else {
      setLicenseError(result.message);
      setLicenseSuccess(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-prussian font-display mt-4">Settings</h1>

      {/* --- SUBSCRIPTION CARD --- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="font-bold text-prussian mb-4 flex items-center gap-2 text-lg">
          <Crown size={18} className="text-orange" /> Subscription Status
        </h2>

        {/* Status Indicator */}
        <div className="flex items-center gap-3 p-4 rounded-xl mb-4 bg-alabaster">
          {licenseStatus.status === 'active' ? (
            <>
              <div className="p-2 bg-green-100 rounded-full"><CheckCircle className="text-green-600" size={20} /></div>
              <div>
                <p className="font-bold text-green-700">Pro Version Active</p>
                <p className="text-xs text-green-600">Unlimited access enabled</p>
              </div>
            </>
          ) : (
            <>
              <div className="p-2 bg-orange/10 rounded-full"><Clock className="text-orange" size={20} /></div>
              <div>
                <p className="font-bold text-prussian">Free Trial</p>
                <p className="text-xs text-prussian/60">
                  {licenseStatus.daysLeft > 0 ? `${licenseStatus.daysLeft} days remaining` : 'Trial Expired'}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Activation Input (Hide if already active) */}
        {licenseStatus.status !== 'active' && (
          <div className="space-y-2">
            <label className="text-sm font-bold text-prussian">Activate License</label>
            <div className="flex gap-2">
              <Input 
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                placeholder="Enter License Key"
                className="mb-0 flex-1"
                error={licenseError}
              />
              <Button onClick={handleActivation} className="w-auto px-6">
                {licenseSuccess ? "Done" : "Activate"}
              </Button>
            </div>
            <p className="text-xs text-secondary mt-2">
              Purchase a key to unlock lifetime access.
            </p>
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="font-bold text-prussian mb-4 flex items-center gap-2 text-lg">
          <Edit3 size={18} /> Business Profile
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input value={tempName} onChange={(e) => setTempName(e.target.value)} placeholder="Enter Business Name" className="flex-1 mb-0" />
          <button onClick={handleSaveName} className="bg-orange text-prussian px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-orange/80 transition-colors h-[52px] sm:w-auto w-full">
            <Save size={16} /> Save
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="font-bold text-prussian mb-4 text-lg">Data Management</h2>
        
        <div className="space-y-3">
          <button onClick={handleExportCSV} className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-alabaster transition-colors text-left group">
            <div className="p-2 bg-green-50 text-green-600 rounded-xl group-hover:scale-110 transition-transform"><FileSpreadsheet size={20} /></div>
            <div>
              <p className="font-bold text-prussian">Export Report</p>
              <p className="text-xs text-prussian/50">Download Sales as CSV</p>
            </div>
          </button>

          <button onClick={backupDatabase} className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-alabaster transition-colors text-left group">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform"><Download size={20} /></div>
            <div>
              <p className="font-bold text-prussian">Backup Data</p>
              <p className="text-xs text-prussian/50">Save full database as JSON</p>
            </div>
          </button>

          <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-alabaster transition-colors text-left group">
            <div className="p-2 bg-orange/10 text-orange rounded-xl group-hover:scale-110 transition-transform"><Upload size={20} /></div>
            <div>
              <p className="font-bold text-prussian">Restore Data</p>
              <p className="text-xs text-prussian/50">Load backup file</p>
            </div>
          </button>
          <input type="file" ref={fileInputRef} onChange={handleRestore} className="hidden" accept=".json" />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
        <h2 className="font-bold text-red-600 mb-4 flex items-center gap-2 text-lg">
          <Shield size={18} /> Danger Zone
        </h2>
        <button onClick={() => { if(confirm("Clear all data?")) { db.delete(); window.location.reload(); } }} className="w-full py-3 rounded-xl bg-red-50 text-red-600 font-bold border border-red-200 hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
          <Trash2 size={16} /> Delete All Data
        </button>
      </div>
    </div>
  );
};

export default Settings;
