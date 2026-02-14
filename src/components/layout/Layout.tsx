import React from 'react';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-container">
      {/* Main Content Area */}
      <main className="pb-24 md:pb-20 px-4 pt-4">
        {children}
      </main>
      
      {/* Responsive Bottom Nav 
          Sticks to bottom on mobile.
          On Desktop (md+), it stays inside the centered container. 
      */}
      <div className="fixed bottom-0 left-0 right-0 md:relative md:mt-0 z-40">
        {/* The inner div centers the nav on desktop to match the container width */}
        <div className="md:max-w-[420px] md:mx-auto">
          <BottomNav />
        </div>
      </div>
    </div>
  );
};

export default Layout;
