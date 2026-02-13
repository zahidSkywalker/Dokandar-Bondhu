import React, { useState } from 'react';
import { Plus, Trash2, Building2, Phone, Edit3 } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

const Suppliers: React.FC = () => {
  const { t, lang } = useLanguage();
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
    } catch (err) { alert("Error adding supplier"); }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (confirm(t('common.confirmDelete'))) {
      await db.suppliers.delete(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-prussian font-display">{t('suppliers.title')}</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-orange text-prussian p-3 rounded-2xl shadow-xl active:scale-95 transition-transform">
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-3">
        {!suppliers ? <div className="text-center p-8">Loading...</div> : suppliers.length === 0 ? (
          <div className="p-16 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white">
            <Building2 className="mx-auto text-prussian/20 mb-4" size={64} />
            <p className="text-prussian/50 font-medium">No suppliers yet.</p>
          </div>
        ) : (
          suppliers.map((supplier, i) => (
            <div key={supplier.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-start stagger-item" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-prussian text-lg">{supplier.name}</h3>
                  {supplier.phone && <p className="text-xs text-prussian/50 flex items-center gap-1"><Phone size={10}/> {supplier.phone}</p>}
                  {supplier.notes && <p className="text-xs text-prussian/40 mt-1">{supplier.notes}</p>}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                 {supplier.totalDue && supplier.totalDue > 0 ? (
                   <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600">Due: ৳{supplier.totalDue}</span>
                 ) : (
                   <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600">Cleared</span>
                 )}
                 <button onClick={() => handleDelete(supplier.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                   <Trash2 size={16} />
                 </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('suppliers.addSupplier')}>
        <form onSubmit={handleAdd} className="space-y-2">
          <Input label="Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <Input label="Phone" type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          <Input label="Total Due (Optional)" type="number" value={formData.totalDue} onChange={(e) => setFormData({...formData, totalDue: e.target.value})} />
          <Input label="Notes" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
          <div className="h-6" />
          <Button icon={<Plus size={20} />}>Save Supplier</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Suppliers;
