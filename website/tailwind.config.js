/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'cormorant':  ['var(--font-cormorant)',  'Cormorant Garamond', 'Georgia', 'serif'],
        'montserrat': ['var(--font-montserrat)', 'Montserrat', 'system-ui', 'sans-serif'],
        'playfair':   ['var(--font-playfair)',   'Playfair Display', 'Georgia', 'serif'],
        'dm-sans':    ['var(--font-dm-sans)',     'DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy:       '#0A1628',
        navyMid:    '#0F2040',
        darkNavy:   '#060E18',
        midNavy:    '#0F2040',
        gold:       '#B8965A',
        goldLight:  '#D4B07A',
        goldDark:   '#9A7A48',
        goldPale:   '#F5EDD8',
        cream:      '#FAF8F3',
        offWhite:   '#F2EFE8',
        warmWhite:  '#FDFCFA',
        charcoal:   '#1E2028',
        textMid:    '#3C3C4E',
        textLight:  '#6B6B80',
        textFaint:  '#A0A0B0',
        greyLight:  '#F2EFE8',
      },
    },
  },
  plugins: [],
}
