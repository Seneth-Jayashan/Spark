/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#FFD700",
        "dark-blue": "#0B2545",
        "blue-800": "#1A3B6D",
        "blue-700": "#22497C",
      },
    },
  },
  plugins: [],
}
