import React, { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity opacity-100"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className={`
        relative w-full sm:w-[480px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-slide-up
        ${theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-100'}
      `}>
        <div className="sticky top-0 z-10 px-6 py-5 border-b flex justify-between items-center backdrop-blur-md bg-opacity-90
          ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}
        ">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">{title}</h2>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
