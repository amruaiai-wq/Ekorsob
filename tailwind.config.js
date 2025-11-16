/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  // 👇 บรรทัดนี้สำคัญมาก!
  darkMode: 'class',
  
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(20px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        blob: {
          '0%': { 
            transform: 'translate(0px, 0px) scale(1)' 
          },
          '33%': { 
            transform: 'translate(30px, -50px) scale(1.1)' 
          },
          '66%': { 
            transform: 'translate(-20px, 20px) scale(0.9)' 
          },
          '100%': { 
            transform: 'translate(0px, 0px) scale(1)' 
          },
        },
      },
    },
  },
  plugins: [],
}
