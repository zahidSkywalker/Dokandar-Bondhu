/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        prussian: '#14213D',
        orange: '#FCA311',
        alabaster: '#F8F9FA',
        'gray-border': '#E5E7EB',
      },
      fontFamily: {
        sans: ['Hind Siliguri', 'sans-serif'],
        display: ['Federant', 'cursive'],
      },
      fontSize: {
        'h1': '24px',
        'h2': '20px',
        'body': '14px',
        'body-lg': '16px',
        'small': '12px',
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0,0,0,0.05)',
        'float': '0 4px 14px rgba(0,0,0,0.1)',
        'sheet': '0 -10px 40px rgba(0,0,0,0.1)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      }
    },
  },
  plugins: [],
}
