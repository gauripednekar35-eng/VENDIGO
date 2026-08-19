/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0B0F17',
          surface: '#0F172A',
          card: '#1E293B',
          cardHover: '#2A3852',
          border: '#334155',
          text: '#FFFFFF',
          muted: '#CBD5E1',
        },
        primary: {
          DEFAULT: '#059669', // Solid High-Contrast Emerald
          light: '#10B981',
          dark: '#047857',
          50: '#ECFDF5',
          100: '#D1FAE5',
          600: '#059669',
        },
        orange: {
          DEFAULT: '#F97316', // Solid High-Contrast Orange
          light: '#FB923C',
          dark: '#EA580C',
          50: '#FFF7ED',
          100: '#FFEDD5',
        },
        brand: {
          bg: '#0B0F17',
          card: '#1E293B',
          darkText: '#FFFFFF',
          mutedText: '#CBD5E1',
          border: '#334155',
          green: '#059669',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(0,0,0,0.5)',
        'card': '0 4px 20px rgba(0,0,0,0.7)',
        'hover': '0 12px 32px rgba(5,150,105,0.3)',
        'emerald-glow': '0 0 20px rgba(5,150,105,0.5)',
        'orange-glow': '0 0 20px rgba(249,115,22,0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
        'bottom-nav': '0 -4px 24px rgba(0,0,0,0.8)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
