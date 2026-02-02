import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'electric-yellow': '#FFD700',
        'safety-orange': '#FF4500',
        'industrial-grey': '#808080',
        'off-white': '#F0F0F0',
        'stark-black': '#000000',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px #000000',
        'neo-hover': '2px 2px 0px 0px #000000',
        'neo-deep': '8px 8px 0px 0px #000000',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
      },
    },
  },
  plugins: [],
} satisfies Config;
