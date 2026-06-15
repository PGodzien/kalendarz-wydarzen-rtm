import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter Tight', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        paper:   '#fafaf8',
        ink:     '#111110',
        'ink-2': '#555553',
        'ink-3': '#99998f',
        rule:    '#e4e4e0',
        'rule-2':'#f0f0ec',
        hover:   '#f4f4f0',
      },
      fontSize: {
        '2xs': ['0.68rem', { lineHeight: '1rem' }],
      },
    },
  },
  plugins: [],
}

export default config
