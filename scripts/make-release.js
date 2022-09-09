#!env node

// SPDX-FileCopyrightText: 20022 Patchfox Authors
//
// SPDX-License-Identifier: CC0-1.0

const path = require("path")
const fs = require("fs")
const { spawn } = require("child_process")
const rimraf = require("rimraf")
const PackageJSON = require("../package.json")
const version = PackageJSON.version

const releaseNotes = "./build/release-notes.md"

const windowsFiles = [
  `./build/Patchfox-${version}-ia32-win.zip#Patchfox for Windows (32bits)`,
  `./build/Patchfox-${version}-win.zip#Patchfox for Windows (64bits)`,
  `./build/Patchfox-${version}-arm64-win.zip#Patchfox for Windows (arm64)`,
]

const linuxFiles = [
  `./build/Patchfox-${version}-universal.dmg#Patchfox for macOS (universal)`
]

const macFiles = [
  `./build/Patchfox-${version}.tar.gz#Patchfox for Linux (64bits)`,
  `./build/Patchfox-${version}-arm64.tar.gz#Patchfox for Linux (arm64)`,
]

const files = [
  ...windowsFiles,
  ...linuxFiles,
  ...macFiles
]

files.forEach(fileWithLabel => {
  let f = fileWithLabel.slice(0, fileWithLabel.indexOf("#"))
  if (!fs.existsSync(f)) {
    throw `Missing release file: '${f}'`
  }
})

if (!fs.existsSync(releaseNotes)) {
  throw "missing release notes"
}

const fileList = files

let args = [
  "release",
  `create`,
  `v${version}`,
  "-p",
  "--discussion-category",
  "General",
  `--title`,
  `Patchfox v${version} Pre-release`,
  `-F`,
  `${releaseNotes}`,
  ...fileList
]
const defaults = {
  cwd: process.cwd(),
  env: process.env
}
const child = spawn("gh", args)

child.stdout.on("data", data => {
  console.log(`stdout:\n${data}`)
})

child.stderr.on("data", data => {
  console.error(`stderr: ${data}`)
})
