/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'xs': '0.7rem',
        'sm': '0.8rem',
        'base': '0.875rem',
        'lg': '1rem',
        'xl': '1.125rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      colors: {
        // ─────────────────────────────────────────────────────────────
        // BRAND — TUC Academy purple. Primary action + identity colour.
        // Every `primary-*` class across the app resolves here, so the
        // dashboard, auth pages and landing page share one brand colour.
        // ─────────────────────────────────────────────────────────────
        primary: {
          50: '#f6f4ff',
          100: '#ede9fe',
          200: '#ded5fd',
          300: '#c4b2fb',
          400: '#a385f6',
          500: '#8759ef',
          600: '#7539e0', // ← primary action colour (6.1:1 on white)
          700: '#6528c2',
          800: '#54219e',
          900: '#451d80',
          950: '#2b0f57',
        },
        // `brand` is an alias of `primary` for landing-page/semantic use.
        brand: {
          50: '#f6f4ff',
          100: '#ede9fe',
          200: '#ded5fd',
          300: '#c4b2fb',
          400: '#a385f6',
          500: '#8759ef',
          600: '#7539e0',
          700: '#6528c2',
          800: '#54219e',
          900: '#451d80',
          950: '#2b0f57',
        },
        // ─────────────────────────────────────────────────────────────
        // SECONDARY — ink neutrals. Text, borders, secondary surfaces and
        // dark sections. (Previously undefined, which silently broke
        // `bg-secondary-*` / `text-secondary-*` on Button and Badge.)
        // ─────────────────────────────────────────────────────────────
        secondary: {
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
        // ─────────────────────────────────────────────────────────────
        // ACCENT — amber. Rationed: ratings, "popular" flags, one-off
        // highlights. Never used for large fills next to purple.
        // ─────────────────────────────────────────────────────────────
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        // Purple wash used behind hero / CTA bands.
        'brand-gradient': 'linear-gradient(135deg, #7539e0 0%, #54219e 55%, #2b0f57 100%)',
        'brand-soft': 'linear-gradient(180deg, #f6f4ff 0%, #ffffff 100%)',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        // Purple-tinted elevation for brand surfaces.
        'brand': '0 10px 30px -10px rgba(117, 57, 224, 0.35)',
        'brand-lg': '0 24px 60px -20px rgba(117, 57, 224, 0.45)',
        'lift': '0 20px 45px -20px rgba(15, 23, 42, 0.25)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'marquee': 'marquee 32s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
