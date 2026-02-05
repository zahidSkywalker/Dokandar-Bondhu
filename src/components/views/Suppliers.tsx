import React, { useState } from 'react';
import { Trash2, Phone, Plus, Search, DollarSign, CheckCircle } from 'lucide-react';
import { useSuppliers } from '../../hooks/useSuppliers';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency } from '../../lib/utils';

const Suppliers: React.FC = () => {
  const { t, lang } = useLanguage();
  const { theme } = useTheme();
  const { suppliers, addSupplier, deleteSupplier } = useSuppliers();
  const [activeTab, setActiveTab] = useState<'list' | 'due'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  // Derived Data
  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const suppliersWithDue = suppliers.filter(s => {
    // Recalculate due based on filtered list
    const expenses = []; // In a real hook, this would be calculated.
    return { supplier: s, dueAmount: 0 }; 
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = (e.target as any).name.value;
    if (!name.trim()) return;
    await addSupplier({ name });
    (e.target as any).reset();
  };

  const handlePay = (supplier: Supplier) => {
    // Placeholder: Open payment modal logic
    alert(`Payment for ${supplier.name} initiated.`);
  };

  return (
    <div className="pb-24 max-w-2xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6 mt-2">
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>
          {t('dashboard.title')} / Suppliers
        </h1>
        <button 
          onClick={() => setSelectedSupplier(null)}
          className="bg-earth-800 text-white p-3 rounded-xl shadow-lg active:scale-95 flex items-center gap-2"
        >
          {selectedSupplier ? <CheckCircle size={20} /> : <Plus size={20} />}
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-3.5 text-earth-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search suppliers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-12 pr-4 py-3 rounded-xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-cream-200 text-earth-900'} focus:outline-none focus:ring-2 focus:ring-earth-600`}
        />
      </div>

      {/* Tabs */}
      <div className={`flex gap-2 mb-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-cream-100'}`}>
        <button 
          onClick={() => setActiveTab('list')}
          className={`flex-1 py-3 rounded-xl font-bold transition-all ${
            activeTab === 'list' 
              ? 'bg-white text-earth-900 shadow-md' 
              : 'text-earth-600 hover:text-earth-900'
          }`}
        >
          All Suppliers ({suppliers.length})
        </button>
        <button 
          onClick={() => setActiveTab('due')}
          className={`flex-1 py-3 rounded-xl font-bold transition-all ${
            activeTab === 'due' 
              ? 'bg-white text-earth-900 shadow-md' 
              : 'text-earth-600 hover:text-earth-900'
          }`}
        >
          Due Payments
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'list' ? (
          <div className="space-y-3">
            {filteredSuppliers.length === 0 ? (
              <div className={`p-10 text-center rounded-2xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
                <p className="font-medium text-gray-500">No suppliers found</p>
              </div>
            ) : (
              filteredSuppliers.map((supplier) => (
                <div 
                  key={supplier.id}
                  onClick={() => setSelectedSupplier(supplier)}
                  className={`p-5 rounded-2xl border shadow-sm cursor-pointer transition-all active:scale-[0.98] ${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>
                        {supplier.name}
                      </h3>
                      {supplier.phone && (
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-earth-500'}`}>
                          <Phone size={14} className="inline w-3 h-3 mr-2" />
                          {supplier.phone}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {suppliersWithDue.length === 0 ? (
              <div className="p-10 text-center text-gray-500">No due payments</div>
            ) : (
              suppliersWithDue.map(item => (
                <div 
                  key={item.supplier.id}
                  className={`p-5 rounded-2xl border shadow-sm ${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>
                        {item.supplier.name}
                      </h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-earth-500'}`}>
                        Unpaid
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-lg ${item.dueAmount > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                        <p className="text-xl font-bold text-earth-900">
                          {formatCurrency(item.dueAmount, lang)}
                        </p>
                      </div>
                      <button 
                        onClick={() => handlePay(item.supplier)}
                        disabled={item.dueAmount === 0}
                        className={`ml-3 p-2 rounded-lg shadow-sm transition-colors ${
                          item.dueAmount > 0 ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500'
                        }`}
                      >
                        <DollarSign size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Add Modal */}
      <button 
        onClick={() => setSelectedSupplier({ id: 0, name: '', phone: '' })}
        className="fixed bottom-24 right-6 bg-earth-800 text-white p-4 rounded-full shadow-2xl z-50 flex items-center gap-2 active:scale-110"
      >
        <Plus size={28} />
      </button>
    </div>
  );
};

export default Suppliers;
