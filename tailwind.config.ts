import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        porcelain: '#FCFAF6',
        ivory: '#F6F1E8',
        linen: '#F1EADD',
        champagne: '#E4CE99',
        gold: '#C9A66B',
        'gold-soft': '#D9C08E',
        bronze: '#9A7B45',
        nude: '#E9DECB',
        'nude-deep': '#CBB79A',
        espresso: '#2A241C',
        'espresso-soft': '#5B5142',
        ink: '#1C1813',
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        roman: ['var(--font-cinzel)', 'Georgia', 'serif'],
        sans: ['var(--font-jost)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        luxe: '0.28em',
        wideluxe: '0.42em',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(42,36,28,0.04), 0 12px 40px -18px rgba(42,36,28,0.14)',
        lift: '0 2px 6px rgba(42,36,28,0.05), 0 30px 60px -28px rgba(154,123,69,0.28)',
        glass: '0 1px 0 rgba(255,255,255,0.6) inset, 0 20px 50px -30px rgba(42,36,28,0.2)',
      },
      backgroundImage: {
        'gold-line':
          'linear-gradient(90deg, transparent, rgba(201,166,107,0.55) 20%, rgba(201,166,107,0.9) 50%, rgba(201,166,107,0.55) 80%, transparent)',
        'gold-fade':
          'linear-gradient(135deg, #E4CE99 0%, #C9A66B 45%, #A67C4E 100%)',
        'porcelain-veil':
          'radial-gradient(120% 120% at 50% 0%, #FFFFFF 0%, #FCFAF6 40%, #F6F1E8 100%)',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.55' },
          '70%': { transform: 'scale(1.9)', opacity: '0' },
          '100%': { transform: 'scale(1.9)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 2.6s cubic-bezier(0.4,0,0.6,1) infinite',
        shimmer: 'shimmer 6s linear infinite',
        'float-slow': 'float-slow 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
