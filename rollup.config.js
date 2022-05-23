import svelte from "rollup-plugin-svelte"
import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import json from "@rollup/plugin-json"
import livereload from "rollup-plugin-livereload"
import { terser } from "rollup-plugin-terser"
import css from "rollup-plugin-css-only"
import postcss from "rollup-plugin-postcss"


const onwarn = (warning, onwarn) =>
  (/Unused CSS selector/.test(warning.message)) ||
  onwarn(warning)

const production = !process.env.ROLLUP_WATCH

function serve() {
  let server

  function toExit() {
    if (server) server.kill(0)
  }

  return {
    writeBundle() {
      if (server) return
      server = require("child_process").spawn("npm", ["run", "start", "--", "--dev"], {
        stdio: ["ignore", "inherit", "inherit"],
        shell: true
      })

      process.on("SIGTERM", toExit)
      process.on("exit", toExit)
    }
  }
}

export default {
  input: "ui/index.js",
  output: {
    sourcemap: true,
    format: "cjs",
    file: "dist/assets/bundle.js",
    globals: {
      electron: "electron",
    }
  },
  plugins: [
    postcss({
      extract: "bundle.min.css",
      sourceMap: production,
      minimize: production
    }),
    resolve({
      browser: false,
      //preferBuiltins: true,
      dedupe: ["svelte"]
    }),
    svelte({
      emitCss: true,
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
        css: false
      }
    }),
    json(),
    // we"ll extract any component CSS out into
    // a separate file - better for performance
    css({ output: "bundle.css" }),

    // If you have external dependencies installed from
    // npm, you"ll most likely need these plugins. In
    // some cases you"ll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    commonjs({
      transformMixedEsModules: true
    }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("dist"),

    // If we"re building for production (npm run build
    // instead of npm run dev), minify
    production && terser()
  ],
  watch: {
    clearScreen: false
  },
  onwarn
}
