import React from 'react';
import { AppProvider } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext'; // NEW
import MainLayout from './components/layout/MainLayout';

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <LanguageProvider>
        <ThemeProvider>
          <SettingsProvider> {/* NEW */}
            <AppProvider>
              <MainLayout />
            </AppProvider>
          </SettingsProvider>
        </ThemeProvider>
      </LanguageProvider>
    </React.StrictMode>
  );
};

export default App;
