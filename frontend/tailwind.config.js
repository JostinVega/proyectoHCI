/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        }
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        bounce: 'bounce 1s infinite',
      },
      colors: {
        'pastel-blue': '#AEC6CF',
        'pastel-green': '#77DD77',
        'pastel-yellow': '#FFECB3',
        'pastel-purple': '#D6A2E8',
        'pastel-pink': '#FFB7C5',
        'pastel-red': '#FF6961',
        'pastel-indigo': '#C3B1E1',
        'pastel-orange': '#FFDAC1',
        'pastel-teal': '#AFE4E0',
      }
    },
  },
  plugins: [],
}