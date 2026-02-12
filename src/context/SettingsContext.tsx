import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  businessName: string;
  setBusinessName: (name: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [businessName, setBusinessNameState] = useState<string>(() => {
    return localStorage.getItem('dokandar-business-name') || 'Dokandar Bondhu';
  });

  const setBusinessName = (name: string) => {
    setBusinessNameState(name);
    localStorage.setItem('dokandar-business-name', name);
  };

  return (
    <SettingsContext.Provider value={{ businessName, setBusinessName }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
