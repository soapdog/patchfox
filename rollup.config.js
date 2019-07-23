import svelte from "rollup-plugin-svelte";
import resolve from "rollup-plugin-node-resolve";
import json from "rollup-plugin-json";
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import copy from "rollup-plugin-copy"

const production = !process.env.ROLLUP_WATCH;

export default [{
    input: "src/main.js",
    output: {
        sourcemap: true,
        format: "iife",
        name: "app",
        file: "dist/bundle.js"
    },
    plugins: [
        svelte({
            // enable run-time checks when not in production
            dev: !production,
            // we'll extract any component CSS out into
            // a separate file — better for performance
            css: css => {
                css.write("dist/bundle.css");
            }
        }),

        // If you have external dependencies installed from
        // npm, you'll most likely need these plugins. In
        // some cases you'll need additional configuration —
        // consult the documentation for details:
        // https://github.com/rollup/rollup-plugin-commonjs
        resolve(),
        commonjs(),
        json(),

        // Watch the `public` directory and refresh the
        // browser on changes when not in production
        //!production && livereload("public"),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        production && terser(),
        copy({
            targets: {
                "static/": "dist",
                "docs": "dist/docs",
                "manifest.json": "dist/manifest.json"
            },
        })
    ],
    watch: {
        clearScreen: false
    }
}, {
    input: "src/background.js",
    output: {
        sourcemap: true,
        format: "iife",
        name: "background",
        file: "dist/background-bundle.js"
    },
    plugins: [
        svelte({
            dev: !production,
        }),
        resolve(),
        commonjs(),
        json(),
        production && terser(),
    ],
    watch: {
        clearScreen: false
    }
},
{
    input: "src/workers/contactCache.js",
    output: {
        sourcemap: true,
        format: "iife",
        name: "contactCache",
        file: "dist/worker-contact-cache-bundle.js"
    },
    plugins: [
        svelte({
            dev: !production,
        }),
        resolve(),
        commonjs({
            exclude: ["static/**/*"]
        }),
        json(),
        production && terser(),
    ],
    watch: {
        clearScreen: false
    }
}];
