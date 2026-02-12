import React, { useState } from 'react';
import { Plus, Trash2, Building2, Phone, FileText, Edit3 } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

const Suppliers: React.FC = () => {
  const { t, lang } = useLanguage();
  const { theme } = useTheme();
  const { addSupplier } = useApp();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', notes: '', totalDue: '' });

  const suppliers = useLiveQuery(() => db.suppliers.toArray(), []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addSupplier({
        name: formData.name,
        phone: formData.phone,
        notes: formData.notes,
        totalDue: parseFloat(formData.totalDue || '0')
      });
      setIsModalOpen(false);
      setFormData({ name: '', phone: '', notes: '', totalDue: '' });
    } catch (err) {
      alert("Error adding supplier");
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (confirm(t('common.confirmDelete'))) {
      await db.suppliers.delete(id);
    }
  };

  return (
    <div className="pb-24 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6 mt-2">
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>
          {t('suppliers.title')}
        </h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className={`p-3 rounded-2xl shadow-xl active:scale-95 transition-transform ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-earth-800 text-white'}`}
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-4">
        {!suppliers ? (
          <p className="text-center text-gray-400 mt-10">Loading...</p>
        ) : suppliers.length === 0 ? (
          <div className={`p-10 text-center rounded-2xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
            <Building2 className="mx-auto text-earth-200 mb-3 dark:text-gray-600" size={48} />
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-earth-400'}`}>{t('common.noData')}</p>
          </div>
        ) : (
          suppliers.map((supplier) => (
            <div 
              key={supplier.id} 
              className={`p-5 rounded-2xl border shadow-sm flex justify-between items-start ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-gray-700 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>
                    {supplier.name}
                  </h3>
                  {supplier.phone && (
                    <div className={`flex items-center gap-2 text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-earth-500'}`}>
                      <Phone size={12} /> {supplier.phone}
                    </div>
                  )}
                  {supplier.notes && (
                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-earth-400'}`}>
                      {supplier.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                 {supplier.totalDue && supplier.totalDue > 0 ? (
                   <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                     Due: ৳{supplier.totalDue}
                   </span>
                 ) : (
                   <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                     Cleared
                   </span>
                 )}
                 <button 
                   onClick={() => handleDelete(supplier.id)}
                   className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-500' : 'bg-cream-50 hover:bg-red-50 hover:text-red-500 text-earth-400'}`}
                 >
                   <Trash2 size={16} />
                 </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('suppliers.addSupplier')}>
        <form onSubmit={handleAdd} className="space-y-2">
          <Input 
            label="Name" 
            required 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
          />
          <Input 
            label={t('suppliers.phone')} 
            type="tel" 
            value={formData.phone} 
            onChange={(e) => setFormData({...formData, phone: e.target.value})} 
          />
          <Input 
            label="Total Due (Optional)" 
            type="number" 
            value={formData.totalDue} 
            onChange={(e) => setFormData({...formData, totalDue: e.target.value})} 
          />
          <Input 
            label={t('suppliers.notes')} 
            value={formData.notes} 
            onChange={(e) => setFormData({...formData, notes: e.target.value})} 
          />
          <div className="h-6" />
          <Button icon={<Plus size={20} />}>Save Supplier</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Suppliers;
