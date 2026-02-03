import React from 'react';
import { AppProvider } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext'; // <--- IMPORT THIS
import MainLayout from './components/layout/MainLayout';

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <LanguageProvider>
        <ThemeProvider> {/* <--- WRAP EVERYTHING IN THIS */}
          <AppProvider>
            <MainLayout />
          </AppProvider>
        </ThemeProvider>
      </LanguageProvider>
    </React.StrictMode>
  );
};

export default App;
