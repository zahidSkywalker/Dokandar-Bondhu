import React, { useState } from 'react';
import { Plus, Phone, Trash2, Package } from 'lucide-react';
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
  const [formData, setFormData] = useState({ name: '', phone: '', notes: '' });

  // Fetch suppliers
  const suppliers = useLiveQuery(() => db.suppliers.toArray());

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addSupplier(formData);
      setIsModalOpen(false);
      setFormData({ name: '', phone: '', notes: '' });
    } catch (err) {
      alert("Error adding supplier");
    }
  };

  const handleDelete = async (id: number) => {
    if(confirm("Are you sure you want to delete this supplier?")) {
      await db.suppliers.delete(id);
    }
  };

  return (
    <div className="pb-24 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6 mt-2">
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>Suppliers</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className={`p-3 rounded-2xl shadow-xl active:scale-95 transition-transform ${theme === 'dark' ? 'bg-earth-600 text-white' : 'bg-earth-800 text-white'}`}
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-4">
        {!suppliers ? <div className="p-4 text-center">Loading...</div> : suppliers.length === 0 ? (
          <div className={`p-10 text-center rounded-2xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
            <Package className="mx-auto text-earth-200 mb-3 dark:text-gray-600" size={48} />
            <p className={`font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-earth-400'}`}>No suppliers yet.</p>
          </div>
        ) : (
          suppliers.map((supplier) => (
            <div key={supplier.id} className={`p-5 rounded-2xl border shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-cream-200'}`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-gray-700 text-earth-600' : 'bg-earth-50 text-earth-600'}`}>
                    <Package size={20} />
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-earth-900'}`}>{supplier.name}</h3>
                    {supplier.phone && (
                      <p className={`text-xs flex items-center gap-1 ${theme === 'dark' ? 'text-gray-400' : 'text-earth-500'}`}>
                        <Phone size={12}/> {supplier.phone}
                      </p>
                    )}
                    {supplier.notes && (
                      <p className={`text-xs mt-1 italic text-gray-500 max-w-[200px]`}>
                        Note: {supplier.notes}
                      </p>
                    )}
                  </div>
                </div>
                
                <button onClick={() => handleDelete(supplier.id!)} className={`p-3 rounded-xl ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'bg-cream-50 hover:bg-red-50 hover:text-red-500 text-earth-400'}`}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Supplier">
        <form onSubmit={handleAdd} className="space-y-2">
          <Input label="Supplier Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <Input label="Phone Number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          <Input label="Notes" placeholder="Payment terms, address..." value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
          <div className="h-6" />
          <Button icon={<Plus size={20} />}>Save Supplier</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Suppliers;
