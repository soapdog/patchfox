// SPDX-FileCopyrightText: 20022 Patchfox Authors
//
// SPDX-FileCopyrightText: 2021-2022 The Manyverse Authors
//
// SPDX-License-Identifier: CC0-1.0

const path = require("path")
const rimraf = require("rimraf")
const PackageJSON = require("./package.json")

const firstCopyrightYear = 2018
const lastCopyrightYear = new Date().getFullYear()
const AUTHOR = "Andre Alves Garzia"
const NAME_HUMAN = "Patchfox"
const NAME_COMPUTER = "Patchfox"

module.exports = {
  // Metadata ------------------------------------------------------------------
  appId: "org.patchfox.macos",
  productName: NAME_HUMAN,
  copyright: `${firstCopyrightYear}-${lastCopyrightYear} ${AUTHOR}`,
  buildVersion: PackageJSON.version,
  extraMetadata: {
    name: NAME_COMPUTER,
    version: PackageJSON.version,
    description: "A Quirky Secure Scuttlebutt Client",
    author: AUTHOR,
    homepage: "https://patchfox.org",
    license: "MIT",
    repository: "https://github.com/soapdog/patchfox",
  },
  protocols: [{ name: "ssb", schemes: ["ssb"] }],

  // Electron-builder options --------------------------------------------------
  asar: true,
  npmRebuild: true,
  electronVersion: PackageJSON.dependencies.electron,

  // All things files and directories ------------------------------------------
  directories: {
    app: __dirname,
    buildResources: path.join(__dirname, "build-resources"),
    output: path.join(__dirname, "build"),
  },
  files: [
	"node_modules/**/*",
	"!**/node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme}",
	"!**/node_modules/*/{test,__tests__,tests,powered-test,example,examples}",
	"!**/node_modules/*.d.ts",
	"!**/node_modules/.bin",
	"!**/*.{iml,o,hprof,orig,pyc,pyo,rbc,swp,csproj,sln,xproj}",
	"!.editorconfig",
	"!**/._*",
	"!**/.*",
	"!**/{.DS_Store,.git,.hg,.svn,CVS,RCS,SCCS,.gitignore,.gitattributes}",
	"!**/{__pycache__,thumbs.db,.flowconfig,.idea,.vs,.nyc_output}",
	"!**/{appveyor.yml,.travis.yml,circle.yml}",
	"!**/{npm-debug.log,yarn.lock,.yarn-integrity,.yarn-metadata.json}",
    "node_modules/**/build/Release/*.node", // Node native modules
    "node_modules/**/build/Release/*.so*", // Node native modules (Linux)
    "node_modules/**/build/Release/*.dylib", // Node native modules (macOS)
    "node_modules/**/build/Release/*.dll", // Node native modules (Windows)
    "node_modules/electron-window-state", // needed in loader.js
    "package.json",
	"ui/**/*",
	"docs/**/*",
	"app.js",
	"!build",
	"!**/.github",
	"!**/.idea",
	"!.git",
    "!node_modules/electron",
    "!node_modules/*-nodejs-mobile",
  ],
  beforeBuild: (conf) => {
    // Remove prebuilds so to force recompilation for Electron
    console.log("  • beforeBuild, remove native modules prebuilds")
    const node_modules = path.join(__dirname, "node_modules")
    rimraf.sync(node_modules + "/**/**/bufferutil/prebuilds")
    rimraf.sync(node_modules + "/**/**/sodium-native/prebuilds")
    rimraf.sync(node_modules + "/**/**/leveldown/prebuilds")
    rimraf.sync(node_modules + "/**/**/utf-8-validate/prebuilds")
  },

  // Linux-specific configurations ---------------------------------------------
  linux: {
    icon: path.join(__dirname, "build-resources", "linux-app-icon"),
    target: [
      { target: "deb", arch: ["x64", "arm64"] },
      { target: "tar.gz", arch: ["x64", "arm64"] },
      // TODO: Fix support for SSB URIs in Manyverse AppImage, see:
      // https://github.com/electron-userland/electron-builder/issues/5024
      // {target: 'AppImage', arch: ['x64']},
    ],
    desktop: {
      StartupWMClass: NAME_COMPUTER,
    },
    category: "Network",
  },

  deb: {
    packageCategory: "net",
    priority: "optional",
    maintainer: "Andre Alves Garzia <andre@andregarzia.com>",
  },

  // Mac-specific configurations -----------------------------------------------
  mac: {
    icon: path.join(__dirname, "ui", "assets", "images", "patchfox_pixel_512.icns"),
    category: "public.app-category.social-networking",
    darkModeSupport: false,
    target: [{ target: "dmg", arch: ["arm64", "x64"] }],
    identity: null,
  },

  dmg: {
    icon: path.join(__dirname, "ui", "assets", "images", "patchfox_pixel_512.icns"),
    //background: path.join(__dirname, "build-resources", "dmg-background.png"),
  },

  // Windows-specific configurations -------------------------------------------
  win: {
	icon: path.join(__dirname, "ui", "assets", "images", "patchfox_pixel_512.ico"),
    publisherName: AUTHOR,
  },

  nsis: {
    artifactName: "${name}-${version}-windows-${arch}-nsis-installer.${ext}",
    oneClick: false,
    perMachine: false,
    include: path.join(__dirname, "scripts", "installer.nsh"),
  },

  // Publish options -----------------------------------------------------------
  publish: {
    provider: "github",
    protocol: "https",
    owner: "soapdog",
    repo: "patchfox",
    releaseType: "release",
  },
}
