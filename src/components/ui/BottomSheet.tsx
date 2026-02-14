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
  
  // 1. Lock scroll & Hide Navbar
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
      {/* Backdrop - High z-index to cover everything */}
      <div 
        className="absolute inset-0 bg-prussian/30 backdrop-blur-sm animate-fade-in" 
        onClick={onClose} 
      />

      {/* Sheet Container */}
      <div 
        className="relative w-full max-w-lg bg-white rounded-t-xl shadow-sheet animate-slide-up flex flex-col"
        style={{ 
          maxHeight: '85vh',      // Constraint height
          minHeight: '50vh',      // Optional: min height for feel
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 cursor-grab flex-shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-2 pb-4 border-b border-gray-border flex-shrink-0">
          <h2 className="text-h2 text-prussian">{title}</h2>
          <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-alabaster text-prussian/60 active:scale-90 transition-transform">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 overscroll-contain">
          {children}
        </div>

        {/* Sticky Footer - Always visible above keyboard/nav */}
        {footer && (
          <div 
            className="flex-shrink-0 p-6 pt-4 bg-white border-t border-gray-border"
            style={{ 
              // Safe area padding + extra buffer for visual comfort
              paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' 
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomSheet;
