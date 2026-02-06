/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FAF9F6',  // Main Background (Cream White)
          100: '#F5F2EB',
          200: '#E6E0D6',
        },
        earth: {
          50: '#F2EBE5',
          100: '#DCC6B3',
          600: '#8B5E3C', // Primary Brand (Mocha Brown)
          700: '#6D4C41',
          800: '#4E342E',
          900: '#3E2723',
        },
        gold: {
          500: '#D4AF37', // Accents
        }
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
