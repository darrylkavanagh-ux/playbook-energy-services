/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'playfair': ['var(--font-playfair)', 'serif'],
        'dm-sans': ['var(--font-dm-sans)', 'sans-serif'],
      },
      colors: {
        navy: '#0B1A2B',
        darkNavy: '#060E18',
        midNavy: '#112240',
        gold: '#C4A44E',
        goldLight: '#D4B96A',
        goldDark: '#A68A3A',
        cream: '#F8F6F1',
        white: '#FFFFFF',
        offWhite: '#FAFAF8',
        grey: '#8A8A8A',
        greyLight: '#E8E6E1',
        text: '#1E1E1E',
        textMid: '#3A3A3A',
        textLight: '#5A5A5A',
        textFaint: '#999999',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}