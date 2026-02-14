/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        prussian: '#003049',
        orange: '#FCA311',
        alabaster: '#F5F5F5',
        'gray-border': '#E5E5E5',
      },
      // Responsive Typography
      fontSize: {
        'h1': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'h1-lg': ['32px', { lineHeight: '40px', fontWeight: '700' }], // For larger screens
        
        'h2': ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'h2-lg': ['22px', { lineHeight: '28px', fontWeight: '600' }],
        
        'body': ['14px', { lineHeight: '20px' }],
        'body-lg': ['16px', { lineHeight: '24px' }],
        
        'small': ['12px', { lineHeight: '16px' }],
      },
      // Responsive Radius Scale
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
      },
      // Elevation System
      boxShadow: {
        'card': '0 2px 8px rgba(0, 48, 73, 0.06)',
        'float': '0 4px 12px rgba(0, 48, 73, 0.08)',
        'sheet': '0 -10px 40px rgba(0, 48, 73, 0.15)',
      },
      // Responsive Container Widths
      screens: {
        'sm': '640px',
        'md': '768px', // Tablet
        'lg': '1024px', // Desktop
        'xl': '1280px',
      },
      spacing: {
        'safe': 'env(safe-area-inset-bottom, 0px)',
      }
    },
  },
  plugins: [],
}
