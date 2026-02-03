import React from 'react';
import { AppProvider } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import MainLayout from './components/layout/MainLayout';

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <LanguageProvider>
        <AppProvider>
          <MainLayout />
        </AppProvider>
      </LanguageProvider>
    </React.StrictMode>
  );
};

export default App;
