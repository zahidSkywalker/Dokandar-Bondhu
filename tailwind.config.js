/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // NEW: Modern Khata Palette
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // Main Brand Color
          600: '#0d9488', // Darker Brand
          700: '#0f766e', // Deepest Brand
          800: '#115e59',
          900: '#134e4a',
        },
        accent: {
          500: '#f59e0b', // Amber for warnings/highlights
          600: '#d97706',
        },
        slate: {
          850: '#1e293b', // Card background for dark mode
          950: '#020617', // App background for dark mode
        },
        // Kept for backward compatibility if any old classes linger
        earth: { 
          50: '#FAF9F6', 
          100: '#F5F2EB', 
          600: '#8B5E3C', 
          700: '#6D4C41', 
          800: '#4E342E', 
          900: '#3E2723', 
        },
        cream: {
          50: '#FAF9F6',
          100: '#F5F2EB',
          200: '#E6E0D6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Bengali', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'], // For numbers if needed
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
      animation: {
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
