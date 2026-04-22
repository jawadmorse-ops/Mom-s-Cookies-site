/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  // Enable RTL logical-property variants (rtl: prefix)
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      colors: {
        cream: {
          50:  '#fdfaf4',
          100: '#faf3e0',
          200: '#f5e6c0',
          300: '#edd89a',
          400: '#e5c870',
          500: '#d9ae48',
        },
        cookie: {
          50:  '#fdf6ee',
          100: '#faebd5',
          200: '#f4d3a8',
          300: '#ecb472',
          400: '#e49044',
          500: '#dd7220',
          600: '#ce5b18',
          700: '#ab4316',
          800: '#893619',
          900: '#6f2e17',
        },
        chocolate: {
          50:  '#fdf5ef',
          100: '#fae7d9',
          200: '#f3ccb1',
          300: '#eaaa7f',
          400: '#e07f4b',
          500: '#d96028',
          600: '#cb4b1e',
          700: '#a8391a',
          800: '#862f1b',
          900: '#4a1810',
          950: '#2e0e08',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:    ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'warm-gradient': 'linear-gradient(135deg, #fdfaf4 0%, #faf3e0 50%, #fae7d9 100%)',
      },
    },
  },
  plugins: [],
};
