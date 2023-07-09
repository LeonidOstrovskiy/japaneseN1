/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'magenta-1': '#845EC2',
        'blue-1': '#2C73D2',
        'blue-2': '#0081CF',
        'blue-3': '#0089BA',
        'sea-1': '#008E9B',
        'sea-2': '#008F7A',
        'text-dark': '#4B4453',
        'text-light': '#B0A8B9',
        'text-red': '#AD0A59',
        'text-orange': '#FF8066',
        'text-extra-dark': '#30260E',
        'text-green': '#30A50E',
      },
      fontSize: {
        mm: '0.8rem',
      },
      screens: {
        mm: '450px',
        mmm: '530px',
      },
    },
  },
  plugins: [],
};
