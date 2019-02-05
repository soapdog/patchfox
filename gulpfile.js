/* eslint-env node */
"use strict";

const { series, parallel, src, dest, watch } = require("gulp");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const log = require("gulplog");
const sourcemaps = require("gulp-sourcemaps");
const webExt = require("web-ext").default;
const path = require("path");
const bulkify = require("bulkify");
const del = require("del");
const through = require("through2");
const globby = require("globby");
const sass = require("gulp-sass");

let extensionRunner = {};

// The `clean` function is not exported so it can be considered a private task.
// It can still be used within the `series()` composition.
function clean() {
    return del([
        "debug/**",
        "!debug"
    ]);
}

// The `build` function is exported so it is public and can be run with the `gulp` command.
// It can also be used within the `series()` composition.
function build() {
    // set up the browserify instance on a task basis
    var b = browserify({
        entries: "./src/index.js",
        debug: true
    })
        .transform("bulkify");

    return b.bundle()
        .pipe(source("bundle.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        // Add transformation tasks to the pipeline here.
        .on("error", log.error)
        .pipe(sourcemaps.write("debug"))
        .pipe(dest("debug"));
}

function copyStatic() {
    return src("static/**")
        .pipe(dest("debug/"));
}

function processSass() {

    // Where should gulp look for the sass files?

    // My .sass files are stored in the styles folder

    // (If you want to use scss files, simply look for *.scss files instead)

    return src("styles/*.scss")
        .pipe(sass())
        .on("error", sass.logError)
        .pipe(dest("debug/styles"));


}

function webExtensionRun() {
    let dir = process.cwd();
    webExt.util.logger.consoleStream.makeVerbose();
    webExt.cmd.run({ sourceDir: path.join(dir, "debug") }, { shouldExitProgram: true })
        .then((runner) => extensionRunner = runner);
}

function watcher() {
    watch("static/**", copyStatic);
    watch("src/**", build);
}

function watcherExtension() {
    watch("debug/**", () => extensionRunner.reloadAllExtensions());
}

exports.build = build;
exports.watch = series(clean, copyStatic, processSass,  build, watcher);
exports.dev = series(clean, copyStatic, processSass, build, parallel(webExtensionRun, watcher, watcherExtension));
exports.static = copyStatic;
exports.style = processSass;
exports.clean = clean;
exports.default = series(clean, copyStatic, processSass, build);
