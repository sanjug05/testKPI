/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0A1628',
        teal: '#00B4D8',
        gold: '#FFD700',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0,0,0,0.35)',
      },
      borderRadius: {
        glass: '16px',
      },
    },
  },
  plugins: [],
};
