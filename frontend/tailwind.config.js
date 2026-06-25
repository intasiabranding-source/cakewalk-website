/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warmCream: '#EFE6DE',
        crispCarrot: '#9A0002',
        forestGreen: '#2D2D2D',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      animation: {
        'antigravity': 'float 6s ease-in-out infinite',
        'antigravity-delayed': 'float-delayed 6s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'float-delayed': {
          '0%, 100%': { transform: 'translateY(-6px)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      boxShadow: {
        'luxury': '0 20px 50px rgba(154, 0, 2, 0.12)',
        'luxury-hover': '0 30px 60px rgba(154, 0, 2, 0.22)',
      }
    },
  },
  plugins: [],
}
