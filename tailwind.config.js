/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      spacing: {
        '96': '24rem',
      }
    }
  },
  plugins: [],
}

