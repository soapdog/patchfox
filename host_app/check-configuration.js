if (process.platform === "win32") {
  console.log("This script does work on windows")
  process.exit(1)
}

var homedir = require('os').homedir()
var macPath = homedir + "/Library/Application Support/Mozilla/NativeMessagingHosts/patchfox.json"
var linuxPath = homedir + "/.mozilla/native-messaging-hosts/patchfox.json"
var manifestPath = process.platform === "darwin" ? macPath : linuxPath
var fs = require("fs")

if (!fs.existsSync(manifestPath)) {
  console.log("[ERROR] App manifest not found at declared location", manifestPath)
  console.log("\nTry: npm run setup\n")
  process.exit(1)
}

console.log("[INFO] App manifest path location:", manifestPath)

let manifest = JSON.parse(fs.readFileSync(manifestPath))

let applicationLauncherPath = manifest.path

if (!fs.existsSync(applicationLauncherPath)) {
  console.log("[ERROR] Launcher not found at declared location", applicationLauncherPath)
  console.log("\nTry: npm run setup\n")
  process.exit(1)
}

console.log("[OK] Configuration appears correct\n[INFO] App located at:", applicationLauncherPath)

process.exit(0)
