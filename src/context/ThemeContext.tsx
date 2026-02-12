import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

// Predefined Professional Palettes
export const ACCENT_COLORS = {
  teal: { name: 'Ocean Teal', value: '#0d9488', tailwind: 'bg-teal-600' },
  blue: { name: 'Royal Blue', value: '#2563eb', tailwind: 'bg-blue-600' },
  purple: { name: 'Royal Purple', value: '#7c3aed', tailwind: 'bg-purple-600' },
  orange: { name: 'Sunset Orange', value: '#ea580c', tailwind: 'bg-orange-600' },
  green: { name: 'Forest Green', value: '#16a34a', tailwind: 'bg-green-600' },
  rose: { name: 'Rose Pink', value: '#e11d48', tailwind: 'bg-rose-600' },
};

type AccentKey = keyof typeof ACCENT_COLORS;

interface ThemeContextType {
  mode: ThemeMode;
  theme: 'light' | 'dark'; // Computed theme
  accent: AccentKey;
  setMode: (mode: ThemeMode) => void;
  setAccent: (accent: AccentKey) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('dokandar-mode') as ThemeMode) || 'system';
  });
  
  const [accent, setAccentState] = useState<AccentKey>(() => {
    return (localStorage.getItem('dokandar-accent') as AccentKey) || 'teal';
  });

  const [computedTheme, setComputedTheme] = useState<'light' | 'dark'>('light');

  // 1. Compute Theme based on Mode & System Preference
  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (theme: 'light' | 'dark') => {
      setComputedTheme(theme);
      if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
      }
    };

    if (mode === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      applyTheme(systemTheme);

      // Listener for system changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => applyTheme(e.matches ? 'dark' : 'light');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      applyTheme(mode);
    }
  }, [mode]);

  // 2. Apply Accent Color CSS Variables
  useEffect(() => {
    const color = ACCENT_COLORS[accent].value;
    // For simplicity in production, we override the primary CSS variable
    // In a real Tailwind setup, you might use CSS variables mapping in tailwind.config.js
    document.documentElement.style.setProperty('--color-primary', color);
    document.documentElement.style.setProperty('--color-primary-600', color); // Simplified
    localStorage.setItem('dokandar-accent', accent);
  }, [accent]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem('dokandar-mode', newMode);
  };

  const setAccent = (newAccent: AccentKey) => {
    setAccentState(newAccent);
  };

  return (
    <ThemeContext.Provider value={{ mode, theme: computedTheme, accent, setMode, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
