import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Language, Translation } from '../types';
import { TRANSLATIONS } from '../lib/constants';

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    // Check local storage for saved preference or default to 'en'
    const saved = localStorage.getItem('dokandar-lang') as Language;
    return saved || 'en';
  });

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'bn' : 'en';
    setLang(newLang);
    localStorage.setItem('dokandar-lang', newLang);
  };

  // Optimized translation function using nested key access
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = TRANSLATIONS[lang];
    
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        console.warn(`Translation missing for key: ${key} in lang: ${lang}`);
        return key; // Fallback to key
      }
    }
    
    return value;
  };

  const value = useMemo(() => ({ lang, toggleLang, t }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
