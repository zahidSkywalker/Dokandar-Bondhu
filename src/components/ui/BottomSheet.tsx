import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, title, children }) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('sheet-open');
    } else {
      document.body.classList.remove('sheet-open');
    }
    return () => document.body.classList.remove('sheet-open');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-prussian/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet Container */}
      <div 
        ref={sheetRef}
        className="relative w-full max-w-lg bg-white rounded-t-xl shadow-sheet animate-slide-up flex flex-col"
        style={{ 
          maxHeight: '85vh', 
          paddingBottom: 'env(safe-area-inset-bottom)' 
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2 cursor-grab">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-100">
          <h2 className="text-h2 text-prussian">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-alabaster transition-colors text-prussian/60"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
