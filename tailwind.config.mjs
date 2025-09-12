/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        magic: { bg: "#0b0b0f", panel: "#12121a", gold: "#ffd166", purple: "#7b2cbf" }
      },
      fontFamily: { display: ['Inter','ui-sans-serif','system-ui','sans-serif'] },
      boxShadow: { card: "0 10px 25px rgba(0,0,0,0.35)" },
      borderRadius: { "2xl": "1.25rem" }
    },
  },
  plugins: [],
};