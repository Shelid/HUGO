import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#0B0C0E',
        charcoal: '#141619',
        'slate-deep': '#1D2025',
        alabaster: '#F6F5F1',
        limestone: '#ECEAE2',
        'stone-warm': '#DCD8CC',
        copper: '#B85D3B',
        bronze: '#9E7B56',
      },
      opacity: {
        '2': '0.02',
        '3': '0.03',
        '4': '0.04',
        '6': '0.06',
        '7': '0.07',
        '8': '0.08',
        '12': '0.12',
        '15': '0.15',
        '18': '0.18',
        '22': '0.22',
        '28': '0.28',
        '32': '0.32',
        '35': '0.35',
        '38': '0.38',
        '42': '0.42',
        '45': '0.45',
        '48': '0.48',
        '55': '0.55',
        '65': '0.65',
        '72': '0.72',
        '78': '0.78',
        '82': '0.82',
        '85': '0.85',
        '88': '0.88',
        '92': '0.92',
        '94': '0.94',
        '96': '0.96',
        '98': '0.98',
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        display: ['var(--font-syne)', 'var(--font-jakarta)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'arch-grid-light':
          'linear-gradient(to right, rgba(11, 12, 14, 0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(11, 12, 14, 0.055) 1px, transparent 1px)',
        'arch-grid-dark':
          'linear-gradient(to right, rgba(255, 255, 255, 0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.055) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-64': '64px 64px',
        'grid-40': '40px 40px',
      },
      transitionTimingFunction: {
        'arch-ease': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;

