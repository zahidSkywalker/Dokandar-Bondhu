import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Import the License Guard
import { checkLicenseAndAccess } from './lib/license';

// 1. Run the License Check BEFORE rendering React
const isAccessAllowed = checkLicenseAndAccess();

// 2. Only render the App if License is Valid or Trial is Active
if (isAccessAllowed) {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
