const production = !process.env.ROLLUP_WATCH

module.exports = {
  purge: {
    content: [
      "./src/**/*.svelte",
      "./src/**/*.html",
    ],
    enabled: production // disable purge in dev
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui"),
  ],
}
