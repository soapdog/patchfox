let { namespace, task, file, desc, packageTask } = require("jake")
let exec = require("child_process").execSync
let rimraf = require("rimraf")
let fs = require("fs")
let copyfiles = require("copyfiles")

desc("browserify")
task("browserify", [
    "browserify:globals/ssb-client.js",
    "browserify:globals/ssb-sort.js"
], () => { })

namespace("browserify", function () {
    desc("Create globals folder.")
    directory("globals")

    desc("Browserify SSB Client into Globals.");
    file("globals/ssb-client.js", ["browserify:globals", "browserify/ssb-client.js"], function () {
        exec(`npx browserify browserify/ssb-client.js -o globals/ssb-client.js`)
    });

    desc("Browserify SSB Sort into Globals.");
    file("globals/ssb-sort.js", ["browserify:globals", "browserify/ssb-sort.js"], function () {
        exec(`npx browserify browserify/ssb-sort.js -o globals/ssb-sort.js`)
    });
})


desc("delete web_modules/ and globals/")
task("clean", function () {
    rimraf.sync("web_modules")
    rimraf.sync("globals")
    rimraf.sync("dist")
})


desc("Uses snowpack to pack dependencies into web_modules/")
task("snowpack", function () {
    exec("npx snowpack", { stdio: 'inherit' })
})

desc("Rebuild everything")
task("full-rebuild", ["clean", "browserify", "snowpack"], () => { })

desc("Build dist/ folder with Patchfox web-extension in it")
task("dist", ["clean", "browserify", "snowpack"], function () {
    return new Promise((resolve, reject) => {
        let list = new jake.FileList()
        list.include("**/**")
        list.exclude("node_modules")
        list.exclude("browserify")
        list.exclude("package.json")
        list.exclude("package-lock.json")
        list.exclude("Jakefile.js")
        list.exclude("test")
        list.exclude("readme.md")
        list.exclude("dist")

        let arr = list.toArray()

        if (!fs.existsSync("dist/")) {
            fs.mkdirSync("dist")
        }

        arr.push("dist")

        copyfiles(arr, (r1, r2) => {
            resolve()
        })
    })
})

desc("Package patchfox for distribution in AMO")
task("package", ["dist"], function () {
    return new Promise((resolve, reject) => {

        let oldcwd = process.cwd()
        process.chdir("dist")
        exec(`web-ext build --overwrite-dest`)
        process.chdir(oldcwd)
        if (!fs.existsSync("releases/")) {
            fs.mkdirSync("releases")
        }

        let arr = []
        arr.push("dist/web-ext-artifacts/*")
        arr.push("releases")

        copyfiles(arr, 2, (r1, r2) => {
            rimraf.sync("dist/web-ext-artifacts")
            resolve()
        })
    })
})

desc("Does browserify and snowpack task.")
task("default", ["browserify", "snowpack"], function () {
    
});