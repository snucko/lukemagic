/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fade-in 0.5s ease-in-out',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      colors: {
        magic: { bg: "#0b0b0f", panel: "#12121a", gold: "#e0b873", purple: "#5a189a" }
      },
      fontFamily: { 
        display: ['Inter','ui-sans-serif','system-ui','sans-serif'],
        serif: ['Playfair Display', 'serif'] 
      },
      boxShadow: { card: "0 10px 25px rgba(0,0,0,0.35)" },
      borderRadius: { "2xl": "1.25rem" }
    },
  },
  plugins: [],
};