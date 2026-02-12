import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full sm:w-[500px] sm:rounded-2xl rounded-t-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up z-50 pb-safe">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-prussian font-display">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-alabaster rounded-full">
            <X className="w-5 h-5 text-prussian/50" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
