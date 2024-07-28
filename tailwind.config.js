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
        primary: {
          DEFAULT: '#774EE0',
          dark: '#5E3EB7',
          light: '#9A7AE6',
        },
        secondary: {
          DEFAULT: '#34D399',
          dark: '#10B981',
          light: '#6EE7B7',
        },
        background: {
          light: '#F3F4F6',
          // dark: '#1F2937',
          dark: '#111827',
        },
        text: {
          light: '#1F2937',
          dark: '#F9FAFB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'custom': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}