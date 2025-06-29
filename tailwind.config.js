/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['GT Walsheim', 'Inter', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        beige: {
          50: '#fefdfb',
          100: '#fdf9f3',
          200: '#f9f1e6',
          300: '#f4e6d7',
          400: '#edd5c2',
          500: '#e4c4a8',
          600: '#d9b08f',
          700: '#cc9a76',
          800: '#b8845f',
          900: '#9d6f4a',
        },
        blue: {
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '28': '7rem',
        '32': '8rem',
      },
      fontSize: {
        '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        '7xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        '8xl': ['6rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 8px 30px -4px rgba(0, 0, 0, 0.12)',
        'soft-xl': '0 12px 40px -6px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
};