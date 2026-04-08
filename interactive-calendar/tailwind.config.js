// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
      fontFamily: {
        serif: ['"Iowan Old Style"', '"Palatino Linotype"', 'Palatino', 'serif'],
        display: ['"Cormorant Garamond"', '"Baskerville"', 'Garamond', 'serif'],
        body: ['"Avenir Next"', '"Trebuchet MS"', '"Segoe UI"', 'sans-serif'],
      },
      boxShadow: {
        paper: '0 50px 120px -90px rgba(15, 23, 42, 0.75), 0 20px 40px -30px rgba(15, 23, 42, 0.25)',
      },
      keyframes: {
        'float-in': {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'gentle-sway': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      animation: {
        'float-in': 'float-in 600ms ease-out',
        'gentle-sway': 'gentle-sway 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
