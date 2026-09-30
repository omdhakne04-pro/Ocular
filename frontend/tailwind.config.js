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
        ocular: {
          dark: '#070b12',
          card: '#0f172a',
          surface: '#1e293b',
          border: '#334155',
          cyan: '#06b6d4',
          'cyan-bright': '#22d3ee',
          amber: '#f59e0b',
          emerald: '#10b981',
          crimson: '#ef4444',
          violet: '#8b5cf6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'scan-line': 'scanLine 2.5s linear infinite',
        'wave-bar': 'waveBar 0.8s ease-in-out infinite alternate',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
        scanLine: {
          '0%': { top: '0%' },
          '50%': { top: '96%' },
          '100%': { top: '0%' },
        },
        waveBar: {
          '0%': { height: '6px' },
          '100%': { height: '24px' },
        },
      },
    },
  },
  plugins: [],
}
