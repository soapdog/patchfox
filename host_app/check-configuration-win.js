if (process.platform !== "win32") {
  console.log("This script works only on windows")
  process.exit(1)
}

var regedit = require('regedit')
var key = 'HKCU\\Software\\Mozilla\\NativeMessagingHosts\\patchfox'
var fs = require("fs")

regedit.list(key, (err, results) => {
  if (err) {
    console.log(`[ERROR] Registry key: ${key} doesn't exist\n\nTry: npm run setup-win\n`)
    process.exit(1)
  }

  let manifestPath = results[key].values[""].value

  if (!fs.existsSync(manifestPath)) {
    console.log("[ERROR] App manifest not found at declared location", manifestPath)
    console.log("\nTry: npm run setup-win\n")
    process.exit(1)
  }

  console.log("[INFO] App manifest path location:", manifestPath)

  let manifest = JSON.parse(fs.readFileSync(manifestPath))

  let applicationLauncherPath = manifest.path

  if (!fs.existsSync(applicationLauncherPath)) {
    console.log("[ERROR] Launcher not found at declared location", applicationLauncherPath)
    console.log("\nTry: npm run setup-win\n")
    process.exit(1)
  }

  console.log("[OK] Configuration appears correct\n[INFO] App located at:", applicationLauncherPath)

  process.exit(0)
})
