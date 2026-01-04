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
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fc',
          400: '#36aaf8',
          500: '#0c8ee9',
          600: '#0070c7',
          700: '#0159a1',
          800: '#064b85',
          900: '#0b406e',
          950: '#072849',
        },
        accent: {
          50: '#fdf4f3',
          100: '#fce8e6',
          200: '#fad5d1',
          300: '#f5b5ae',
          400: '#ed897e',
          500: '#e25f51',
          600: '#cf4435',
          700: '#ae3629',
          800: '#902f25',
          900: '#782c25',
          950: '#41130f',
        },
        legal: {
          gold: '#D4AF37',
          navy: '#1a365d',
          slate: '#334155',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Source Sans 3', 'system-ui', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'swipe-right': 'swipeRight 0.3s ease-out forwards',
        'swipe-left': 'swipeLeft 0.3s ease-out forwards',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        swipeRight: {
          '0%': { transform: 'translateX(0) rotate(0)', opacity: '1' },
          '100%': { transform: 'translateX(150%) rotate(15deg)', opacity: '0' },
        },
        swipeLeft: {
          '0%': { transform: 'translateX(0) rotate(0)', opacity: '1' },
          '100%': { transform: 'translateX(-150%) rotate(-15deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}

