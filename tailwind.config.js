const production = !process.env.NODE_ENV

module.exports = {
  purge: {
    content: [
      "./ui/**/*.js",
      "./ui/**/*.html",
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
