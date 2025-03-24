/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        mainColor: '#2c3e2e',
        primaryColor: '#4a6b4a',
        accentColor: '#1d3557'
      }
    }
  },
  plugins: []
};
