/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // toggle via <html class="dark">
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // === Brand / status colors (fixed across themes) ===
        primary: {
          DEFAULT: '#2563EB',
          50: '#EFF6FF',
          100: '#DBEAFE',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        success: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
          dark: '#D97706',
        },
        danger: {
          DEFAULT: '#EF4444',
          light: '#F87171',
          dark: '#DC2626',
        },
        // === Dark theme surfaces ===
       dark: {
  bg: '#000000',
  card: '#0A0A0D',
  border: '#1F1F26',
  text: '#F8FAFC',
  muted: '#8B8B96',
},
        // === Light theme surfaces ===
        light: {
          bg: '#F1F5F9',
          card: '#FFFFFF',
          border: '#E2E8F0',
          text: '#0F172A',
          muted: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-light': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        card: '0 4px 24px -4px rgba(0, 0, 0, 0.25)',
        'card-hover': '0 12px 32px -6px rgba(37, 99, 235, 0.35)',
        glow: '0 0 20px rgba(37, 99, 235, 0.45)',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out forwards',
        pulseSoft: 'pulseSoft 2s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite linear',
      },
    },
  },
  plugins: [],
}
