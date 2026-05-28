/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand
        primary: {
          DEFAULT: '#22C55E',
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        // Neutral surfaces
        ink: {
          DEFAULT: '#0F1115',
          900: '#0F1115',
          700: '#1F2937',
          500: '#6B7280',
          400: '#9CA3AF',
          300: '#D1D5DB',
          200: '#E5E7EB',
          100: '#F3F4F6',
          50: '#F5F6F8',
        },
        // Semantic
        bg: '#F5F6F8',
        surface: '#FFFFFF',
        muted: '#6B7280',
        border: '#E5E7EB',
        danger: '#EF4444',
        warning: '#F59E0B',
        success: '#22C55E',
        // Dark mode
        dark: {
          bg: '#0F1115',
          surface: '#1F2937',
          border: '#374151',
        },
      },
      fontFamily: {
        sans: ['System'],
      },
      borderRadius: {
        '4xl': '32px',
      },
      boxShadow: {
        card: '0 4px 12px rgba(15, 17, 21, 0.06)',
        cardLg: '0 10px 28px rgba(15, 17, 21, 0.08)',
      },
    },
  },
  plugins: [],
};
