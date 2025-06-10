/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f472b6',         // pastel pembe
        'primary-dark': '#ec4899',  // koyu pastel pembe
        secondary: '#fbcfe8',       // çok açık pembe
        'secondary-dark': '#f9a8d4',
        background: '#fff1f2',      // arka plan için çok açık pembe
        accent: '#a78bfa',          // yumuşak mor
        muted: '#fef2f2',           // ekstra yumuşaklık için
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

