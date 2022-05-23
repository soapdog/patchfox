// see https://www.electron.build/configuration/configuration

// NOTE
// - this is a more optimized config which prunes un-needed files
// - see config.simple.js for something easier, but makes things a few MB bigger

const fs = require('fs')
const path = require('path')

module.exports = {
  appId: 'com.advanced-ahoy.app',
  directories: {
    output: 'installers'
  },

  /* ADVANDCED SECTION: */

  /* Only include needed files */
  // this is enabled by our noderify bundling
  files: [
    '!builder',
    '!installers',
    '!node_modules',

    /* electron main process */
    'main.bundle.js',

    /* UI files (referenced by main.bundle.js) */
    'ui',

    /* native bindings  (dependencies of main.bundle.js) */
    'node_modules/node-gyp-build/index.js',

    'node_modules/sodium-chloride/index.js',
    'node_modules/sodium-native/index.js',
    'node_modules/sodium-native/prebuilds/${platform}-${arch}/*', // eslint-disable-line

    'node_modules/leveldown/index.js',
    'node_modules/leveldown/prebuilds/${platform}-${arch}/*', // eslint-disable-line

    /* ssb-ahoy ui-window dependency */
    'node_modules/ssb-ahoy/electron/preload.js'
  ],

  // NOTE how to figure out what's needed:
  //   1. run `npm run dist`
  //   2. try to launch the output (see dist/installers/*.AppImage etc)
  //   3. read the errors about what's missing and add it above
  //
  // NOTE that we have to include ! (not) rules in files, otherwise
  // electron-builder auto-adds **/*  (add everything!)

  /* delete files from the pack! */
  afterPack (context) {
    fs.rmSync(path.join(context.appOutDir, 'LICENSE.electron.txt'))
    fs.rmSync(path.join(context.appOutDir, 'LICENSES.chromium.html'))
    // const ls = fs.readdirSync(context.appOutDir)
    // console.log(ls)
  },

  publish: [{
    provider: 'github',
    owner: 'ahau-nz',
    repo: 'ahau',
    releaseType: 'release'
  }],

  ...windows(),
  ...linux(),
  ...mac()
}

function windows () {
  return {
    win: {
      icon: 'builder/win/icon.ico'

      /* Code Signing */
      // publisherName: ['Āhau NZ Limited'],
      // WARNING - this name must *exactly* match the subject/ "issued to" field on the Signing Certificate
      // otherwise in future if this name changes, auto-updating will fail D:

      // certificateSubjectName: 'Āhau NZ Limited', // The name of the subject of the signing certificate
      // NOTE - this field worked for code signing certificate, but not the EV signing
      // certificateSha1: 'A5F49ED3D5EBBCA6EE093BF2A8AA93DA36BDBF56'
      // This is a way to be VERY specific about the exact certificate used. This worked well with EV signing cert.
    },
    nsis: {
      artifactName: '${name}-Windows-${version}.${ext}', // eslint-disable-line
      installerIcon: 'builder/win/setup-icon.ico',
      include: 'builder/win/add-missing-dll.nsh' // fixes missing VCRUNTIME140.dll
      // source: https://github.com/sodium-friends/sodium-native/issues/100
    }
  }
}

function mac () {
  // N = this settings requires for Apple notarization
  // https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/

  return {
    mac: {
      category: 'public.app-category.social-networking',
      icon: 'builder/mac/icon.icns',
      hardenedRuntime: true, // N
      gatekeeperAssess: false // N
    },
    dmg: {
      artifactName: '${name}-Mac-${version}.${ext}', // eslint-disable-line
      background: 'builder/mac/background.png',
      icon: 'builder/mac/dmg-icon.icns',
      sign: false // N
    },
    /* Code Signing */
    afterSign: 'builder/mac/notarize.js' // N
  }
}

function linux () {
  return {
    linux: {
      category: 'Network',
      target: 'AppImage'
    },
    appImage: {
      artifactName: '${name}-Linux-${version}-${arch}.${ext}' // eslint-disable-line
    }
  }
}
