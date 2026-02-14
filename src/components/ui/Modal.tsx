import React, { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    // FIXED: Updated z-index to 100
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div 
        className="fixed inset-0 bg-prussian/40 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full sm:w-[480px] sm:rounded-2xl rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up z-[101] flex flex-col">
        
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2 sm:hidden">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-prussian">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-alabaster rounded-full transition-colors">
            <X className="w-5 h-5 text-prussian/50" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto pb-10">
          {children}
        </div>
      </div>
    </div> 
  );
};

export default Modal;
