import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        // Heatmap semantic category colors
        heatmap: {
          logic: '#ef4444',
          ui: '#3b82f6',
          tests: '#22c55e',
          security: '#f59e0b',
          performance: '#a855f7',
          docs: '#06b6d4',
          config: '#78716c',
          other: '#6b7280',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          '"Fira Code"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'flash-in': {
          '0%': { opacity: '0', transform: 'translateY(6px) scale(0.97)', filter: 'blur(2px)' },
          '15%': { opacity: '1', transform: 'translateY(0) scale(1)', filter: 'blur(0)' },
          '75%': { opacity: '1', transform: 'translateY(0) scale(1)', filter: 'blur(0)' },
          '100%': { opacity: '0', transform: 'translateY(-4px) scale(0.98)', filter: 'blur(1px)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        'skeleton': {
          '0%': { opacity: '0.04' },
          '50%': { opacity: '0.09' },
          '100%': { opacity: '0.04' },
        },
      },
      animation: {
        'flash-in': 'flash-in var(--chunk-duration, 250ms) ease-out forwards',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.2s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config
