
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        // ── AgriAssist Brand Palette ──
        brand: {
          green:      '#2E7D32',
          'green-light': '#A5D6A7',
          'green-dark':  '#1B5E20',
          accent:     '#388E3C',
          bg:         '#F5F7F6',
        },
        'green': {
          '50': '#f0f7f0',
          '100': '#dceadc',
          '200': '#bdd6bd',
          '300': '#93ba93',
          '400': '#6a9c6a',
          '500': '#4c7f4c',
          '600': '#3d673d',
          '700': '#335433',
          '800': '#2E4D2E',
          '900': '#1E331E',
          '950': '#0F1A0F',
        },
        'earth': {
          '50': '#f9f6f3',
          '100': '#f0e9e4',
          '200': '#e2d5cb',
          '300': '#d0b9a8',
          '400': '#b99882',
          '500': '#a67c62',
          '600': '#9c7057',
          '700': '#7d5746',
          '800': '#67493c',
          '900': '#563e34',
          '950': '#2e211c',
        },
        'sky': {
          '50': '#f0f8fe',
          '100': '#dceffd',
          '200': '#c2e3fb',
          '300': '#96d1f8',
          '400': '#64b7f2',
          '500': '#3a9cea',
          '600': '#2682db',
          '700': '#1f6abb',
          '800': '#1f5a98',
          '900': '#204c7a',
          '950': '#17304c',
        },

        primary: {
          DEFAULT: '#4c7f4c',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: '#a67c62',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-up': 'fade-up 0.6s ease-out',
        'pulse-slow': 'pulse-slow 3s infinite',
        'slide-in-left': 'slide-in-left 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
        'bounce-gentle': 'bounce-gentle 2s infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'scale-in': 'scale-in 0.3s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
      },
      boxShadow: {
        'agri': '0 4px 24px rgba(46, 125, 50, 0.12)',
        'agri-lg': '0 8px 40px rgba(46, 125, 50, 0.18)',
        'card': '0 2px 16px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.12)',
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
