if (process.platform !== "win32") {
    console.log("This script works only on windows");
    process.exit(1);
}


var regedit = require('regedit');
var key = 'HKCU\\Software\\Mozilla\\NativeMessagingHosts\\patchfox';
var fs = require("fs");
var appPath = __dirname + "\\app.bat";
var appManifestFile = __dirname + "\\patchfox.json";

if (!fs.existsSync(appPath)) {
    console.log("[ERROR] Application not found at: ", appPath);
    process.exit(1);
}


if (!fs.existsSync(appManifestFile)) {
    console.log("[ERROR] App manifest not found at: ", appManifestFile);
    process.exit(1);
}

let manifest = JSON.parse(fs.readFileSync(appManifestFile));

let applicationLauncherPath = manifest.path;

if (!fs.existsSync(applicationLauncherPath)) {
    console.log("[ERROR] App not found at declared location", applicationLauncherPath);
    console.log("FIXING...");
    manifest.path = appPath;
    fs.writeFileSync(appManifestFile, JSON.stringify(manifest));
} else {
    console.log("[OK] Application found at the correct location", applicationLauncherPath);
}

// This now involves writing to the registry, I am a bit scared of that...

var valuesToPut = {
    'HKCU\\Software\\Mozilla\\NativeMessagingHosts\\patchfox': {
        'patchfox': {
            value: appManifestFile,
            type: 'REG_DEFAULT'
        }
    }
}

regedit.createKey('HKCU\\Software\\Mozilla\\NativeMessagingHosts\\patchfox', function (a, b) {
    console.log("a", a);
    console.log("b", b);


    regedit.putValue(valuesToPut, function (err) {
        if (err) {
            console.log("[ERROR] Problem writing to registry.", err);
            process.exit(1);
        } else {
            console.log("[OK] Wrote manifest path to registry.\n[INFO] Try: npm run check-win");
            process.exit(0);
        }
    });
})
