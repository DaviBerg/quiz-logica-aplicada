/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        mono:    ['"DM Mono"', 'monospace'],
        sans:    ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        bg:      '#0d0f0e',
        surface: '#141714',
        card:    '#191c19',
        border:  '#2a2e2a',
        accent:  '#7fff6e',
        accent2: '#c8ff3e',
        muted:   '#6b776b',
        tagbg:   '#1e251e',
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease both',
        'pulse-dot': 'pulseDot 1s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%,100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%':     { opacity: '1',   transform: 'scale(1.1)' },
        },
      },
    },
  },
  plugins: [],
}
