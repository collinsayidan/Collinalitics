
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eef6ff",
          500: "#2f81f7",
          700: "#1f5fd1",
        },
      },
    },
  },
  plugins: [],
};
