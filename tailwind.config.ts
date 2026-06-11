import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      xs: '475px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0A0F1C',
          light: '#141B2D',
          muted: '#4A5568',
        },
        ivory: {
          DEFAULT: '#FAF8F5',
          dark: '#F0EDE8',
        },
        gold: {
          50: '#FBF7ED',
          100: '#F5EBD0',
          200: '#EBD9A8',
          300: '#DFC47A',
          400: '#D4AF37',
          500: '#C9A227',
          600: '#A8861F',
          700: '#876818',
          800: '#6B5214',
          900: '#4F3D0F',
        },
        sage: {
          50: '#F4F7F5',
          100: '#E4EBE6',
          200: '#C9D6CC',
          300: '#A3B8A8',
          400: '#7A9A82',
          500: '#5C7A6B',
          600: '#4A6357',
        },
        brand: {
          navy: '#0A0F1C',
          gold: '#C9A227',
          cream: '#FAF8F5',
          charcoal: '#1A1F2E',
        },
        navy: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        charcoal: {
          50: '#f8f9fa',
          100: '#f1f3f4',
          200: '#e8eaed',
          300: '#dadce0',
          400: '#bdc1c6',
          500: '#9aa0a6',
          600: '#80868b',
          700: '#5f6368',
          800: '#3c4043',
          900: '#202124',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      boxShadow: {
        soft: '0 4px 24px rgba(10, 15, 28, 0.06)',
        card: '0 8px 32px rgba(10, 15, 28, 0.08)',
        gold: '0 8px 24px rgba(201, 162, 39, 0.15)',
        luxury: '0 24px 48px rgba(10, 15, 28, 0.12)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
export default config
