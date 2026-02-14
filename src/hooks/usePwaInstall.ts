// src/hooks/usePwaInstall.ts
import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const usePwaInstall = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 1. Check if already installed (Standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // 2. Check if iOS Safari (iOS doesn't support 'beforeinstallprompt')
    const isIosDevice = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    if (isIosDevice && !('beforeinstallprompt' in window)) {
      setIsIOS(true);
    }

    // 3. Listen for the native install prompt (Android/Chrome/Edge)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault(); // Prevent Chrome's default mini-infobar
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    // Show the native browser prompt
    installPrompt.prompt();

    // Wait for user response
    const { outcome } = await installPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setInstallPrompt(null);
    }
  };

  return {
    isInstalled,
    canInstall: !!installPrompt, // True if browser supports native prompt
    isIOS, // True if we need to show manual instructions
    handleInstallClick,
  };
};
