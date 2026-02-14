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
  
  // Lock background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
  }, [isOpen]);

  if (!isOpen) return null;

  // Assuming standard Bottom Nav height is 64px (h-16) + 16px buffer = 80px
  // This ensures the sheet sits exactly on top of the nav
  const NAVBAR_OFFSET = '80px'; 

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop - Covers the content but not the nav (visually) */}
      <div 
        className="absolute inset-0 bg-prussian/30 backdrop-blur-sm animate-fade-in" 
        onClick={onClose} 
      />

      {/* Sheet Container - Positioned above the navbar */}
      <div 
        className="relative w-full max-w-lg bg-white rounded-t-xl shadow-sheet animate-slide-up flex flex-col"
        style={{ 
          bottom: NAVBAR_OFFSET, // KEY CHANGE: Sit on top of navbar
          maxHeight: `calc(85vh - ${NAVBAR_OFFSET})`, // Adjust max height accordingly
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

        {/* Sticky Footer */}
        {footer && (
          <div className="flex-shrink-0 p-6 pt-4 bg-white border-t border-gray-border">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomSheet;
