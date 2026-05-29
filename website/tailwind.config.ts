import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
        'dm-sans': ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        sans:      ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy:       '#0B1A2B',
        darkNavy:   '#060D18',
        midNavy:    '#0F2240',
        navyLight:  '#162E50',
        navyCard:   '#0D1F35',
        gold:       '#C4A44E',
        goldLight:  '#D4B96A',
        goldBright: '#E8CC84',
        goldDark:   '#A68A3A',
        goldMuted:  '#8B7230',
        cream:      '#F8F6F1',
        creamDark:  '#EDE9E0',
        offWhite:   '#FAFAF8',
        grey:       '#8A8A8A',
        greyLight:  '#E2E0DB',
        textMid:    '#3A3A3A',
        textLight:  '#6A6A6A',
        textFaint:  '#9A9A9A',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-gold':   'linear-gradient(135deg, #D4B96A 0%, #C4A44E 50%, #A68A3A 100%)',
      },
      boxShadow: {
        gold:      '0 4px 20px rgba(196, 164, 78, 0.3)',
        'gold-lg': '0 8px 40px rgba(196, 164, 78, 0.4)',
        'card':    '0 20px 60px rgba(0,0,0,0.45)',
        'luxury':  '0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(196,164,78,0.2)',
      },
      animation: {
        'fade-up':    'fade-up 0.75s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in':    'fade-in 0.6s ease both',
        'gold-pulse': 'gold-pulse 2.5s infinite',
        'float':      'float 4s ease-in-out infinite',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'gold-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(196,164,78,0.35)' },
          '50%':       { boxShadow: '0 0 0 10px rgba(196,164,78,0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
}

export default config
