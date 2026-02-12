import React from 'react';
import { AppProvider } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import { SettingsProvider } from './context/SettingsContext';
import MainLayout from './components/layout/MainLayout';

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <LanguageProvider>
        <SettingsProvider>
          <AppProvider>
            <MainLayout />
          </AppProvider>
        </SettingsProvider>
      </LanguageProvider>
    </React.StrictMode>
  );
};

export default App;
