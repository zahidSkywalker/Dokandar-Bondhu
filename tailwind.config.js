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
      },
      // 1. Typography Hierarchy
      fontSize: {
        'h1': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'h2': ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'body': ['14px', { lineHeight: '20px' }],
        'body-lg': ['16px', { lineHeight: '24px' }],
        'small': ['12px', { lineHeight: '16px' }],
      },
      // 9. Border Radius Scale
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
      },
      // 4. Elevation System (Soft Shadows)
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.04)', // Subtle
        'float': '0 4px 16px rgba(0, 0, 0, 0.08)', // Medium
        'sheet': '0 -8px 40px rgba(0, 0, 0, 0.12)', // Strongest
      },
      // 7. Motion
      transitionTimingFunction: {
        'out': 'cubic-bezier(0.25, 0.1, 0.25, 1)', // Standard ease-out
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Spring effect
      },
      // 2. 8pt Spacing System (Extending defaults)
      spacing: {
        'safe': 'env(safe-area-inset-bottom)',
      }
    },
  },
  plugins: [],
}
