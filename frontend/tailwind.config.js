/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/pages/**/*.{js,jsx,ts,tsx}', // Keep if you have legacy Pages Router files
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e293b',
        accent: '#f59e42',
        'accent-dark': '#d97706',
        background: '#f8fafc',
        neutral: '#64748b',
        card: '#ffffff',
        border: '#e2e8f0',
        button: '#0d3b66',
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
      },
      boxShadow: {
        card: '0 4px 24px 0 rgba(30, 41, 59, 0.08)',
      },
    },
  },
  plugins: [],
};