/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'prussian': '#14213D', // Primary Dark Blue
        'orange': '#FCA311',   // Accent Orange
        'alabaster': '#E5E5E5', // Background Grey
        'black': '#000000',     // Text Black
        'white': '#FFFFFF',     // Cards/Elements
      },
      fontFamily: {
        // Federant for English, Hind Siliguri for Bangla
        sans: ['"Hind Siliguri"', '"Federant"', 'sans-serif'],
        display: ['"Federant"', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
