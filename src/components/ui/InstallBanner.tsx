import React, { useState } from 'react';
import { Download, X, Share2 } from 'lucide-react';
import { usePwaInstall } from '../../hooks/usePwaInstall';
import Modal from './Modal'; // Assuming you have the Modal component from previous steps

const InstallBanner: React.FC = () => {
  const { isInstalled, canInstall, isIOS, handleInstallClick } = usePwaInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Don't show if already installed or user dismissed it
  if (isInstalled || dismissed) return null;

  // If it's not iOS and we don't have the native prompt yet, don't show
  // (This prevents showing banner on desktop Chrome unless install criteria met)
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (!canInstall && !isIOS && !isMobile) return null;

  const handleAction = () => {
    if (canInstall) {
      handleInstallClick();
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  return (
    <>
      <div className="fixed bottom-20 left-4 right-4 md:max-w-[480px] mx-auto z-[60] animate-slide-up">
        <div className="bg-prussian text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3 border border-orange/20 backdrop-blur-lg">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 bg-orange/20 rounded-xl">
              <Download className="text-orange w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm">Install Dokandar Bondhu</p>
              <p className="text-xs text-white/70 truncate">Tap to add to home screen</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAction}
              className="px-4 py-2 bg-orange text-prussian text-xs font-bold rounded-xl hover:bg-orange/90 transition-all active:scale-95"
            >
              Install
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Dismiss"
            >
              <X size={18} className="text-white/50" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Instruction Modal */}
      <Modal 
        isOpen={showIOSModal} 
        onClose={() => setShowIOSModal(false)} 
        title="Install on iOS"
      >
        <div className="text-center py-4">
          <div className="mb-6 flex justify-center">
            <div className="p-4 bg-alabaster rounded-full">
              <Share2 size={40} className="text-orange" />
            </div>
          </div>
          <p className="text-secondary text-sm mb-4">
            To install the app on your iPhone/iPad:
          </p>
          <ol className="text-left text-sm space-y-3 text-prussian font-medium">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange text-prussian flex items-center justify-center text-xs font-bold">1</span>
              <span>Tap the <strong>Share button</strong> (<Share2 size={14} className="inline text-orange" />) at the bottom of the screen.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange text-prussian flex items-center justify-center text-xs font-bold">2</span>
              <span>Scroll down and tap <strong>"Add to Home Screen"</strong>.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange text-prussian flex items-center justify-center text-xs font-bold">3</span>
              <span>Tap <strong>"Add"</strong> in the top right corner.</span>
            </li>
          </ol>
          <button 
            onClick={() => setShowIOSModal(false)}
            className="mt-8 w-full py-3 bg-prussian text-white rounded-xl font-bold text-sm"
          >
            Got it!
          </button>
        </div>
      </Modal>
    </>
  );
};

export default InstallBanner;
