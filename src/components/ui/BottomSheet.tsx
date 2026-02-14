import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, title, children, footer }) => {
  
  useEffect(() => {
    if (isOpen) document.body.classList.add('no-scroll');
    else document.body.classList.remove('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-prussian/30 backdrop-blur-sm animate-fade-in" 
        onClick={onClose} 
      />

      {/* Container */}
      <div 
        className="relative w-full md:max-w-md bg-white rounded-t-3xl shadow-sheet animate-slide-up flex flex-col max-h-[92vh]"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2 cursor-grab">
          <div className="w-12 h-1.5 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-border flex-shrink-0">
          <h2 className="text-xl font-bold text-prussian">{title}</h2>
          <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-alabaster text-prussian/60 active:scale-90 transition-transform">
            <X size={22} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 overscroll-contain">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex-shrink-0 p-6 pt-4 bg-white border-t border-gray-border rounded-b-3xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomSheet;
