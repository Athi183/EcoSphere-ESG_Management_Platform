/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        env: {
          500: '#10B981', // green
          600: '#059669',
        },
        social: {
          500: '#3B82F6', // blue
          600: '#2563EB',
        },
        gov: {
          500: '#8B5CF6', // purple
          600: '#7C3AED',
        },
        game: {
          500: '#F59E0B', // amber
          600: '#D97706',
        }
      }
    },
  },
  plugins: [],
}
