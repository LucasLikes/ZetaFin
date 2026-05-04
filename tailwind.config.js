/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          400: '#a855f7',
          500: '#9333ea',
          600: '#7c3aed',
        },
        secondary: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        dark: {
          50:  '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        green: {
          500: '#7FE5A8',
          600: '#6DD99A',
        },
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #111827 0%, #030712 100%)',
        'gradient-green': 'linear-gradient(135deg, #7FE5A8 0%, #6DD99A 100%)',
      },
      keyframes: {
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        spin:     'spin 0.7s linear infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      transitionDuration: {
        '200': '200ms',
        '250': '250ms',
      },
    },
  },
  plugins: [],
}