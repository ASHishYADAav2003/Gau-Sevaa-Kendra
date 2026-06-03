/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#3F5E3B', 
          lightGreen: '#4a6741',
          beige: '#F8F4EA',
          dark: '#1a1a1a',
          orange: '#D9A441', 
          brown: '#8B5E34',
        },
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#f97316', 
          600: '#ea580c',
          900: '#7c2d12',
        },
        secondary: '#16a34a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        hindi: ['Noto Serif Devanagari', 'Rozha One', 'serif'], // For hindi text
      },
      animation: {
        'slow-zoom': 'slow-zoom 20s ease-out forwards',
        'fade-in-up': 'fade-in-up 1s ease-out both',
        'golden-glow-fade': 'golden-glow-fade 1s ease-out both',
        'slide-in-right': 'slide-in-right 1s ease-out both',
        'pulse-saffron': 'pulse-saffron 3s infinite',
        'pulse-green': 'pulse-green 3s infinite',
      },
      keyframes: {
        'slow-zoom': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.15)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'golden-glow-fade': {
          '0%': { opacity: '0', filter: 'drop-shadow(0 0 0px transparent)' },
          '50%': { opacity: '0.5', filter: 'drop-shadow(0 0 10px #F59E0B)' },
          '100%': { opacity: '1', filter: 'drop-shadow(0 0 5px rgba(245,158,11,0.5))' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-saffron': {
          '0%, 100%': { boxShadow: '0 0 0px 0px rgba(234, 88, 12, 0)' },
          '50%': { boxShadow: '0 0 25px 10px rgba(234, 88, 12, 0.6)' },
        },
        'pulse-green': {
          '0%, 100%': { boxShadow: '0 0 0px 0px rgba(22, 163, 74, 0)' },
          '50%': { boxShadow: '0 0 20px 8px rgba(22, 163, 74, 0.5)' },
        }
      }
    },
  },
  plugins: [],
}
