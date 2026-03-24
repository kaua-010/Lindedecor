/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        marquee: 'marquee 20s linear infinite',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
      colors: {
        cream: '#F5F0E8',
        sand: '#E8DFD0',
        stone: '#C4B8A4',
        warm: '#8C7B6B',
        earth: '#5C4A3A',
        dark: '#1C1410',
        gold: '#C9A84C',
        gold2: '#E8C96B',
        rust: '#B85C38',
        green: '#4A7C59',
      },
      fontFamily: {
        head: ['Cormorant Garamond', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
