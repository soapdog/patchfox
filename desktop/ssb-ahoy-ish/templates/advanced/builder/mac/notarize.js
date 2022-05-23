const { notarize } = require('electron-notarize')
const { appId } = require('../config.js')

const appleId = process.env.APPLE_ID

exports.default = async function notarizing (context) {
  const { electronPlatformName, appOutDir } = context
  if (electronPlatformName !== 'darwin') return

  if (!appleId) throw new Error('electron builder require env APPLE_ID')

  const appName = context.packager.appInfo.productFilename

  console.log('Starting notarization...')

  return await notarize({ // eslint-disable-line
    appBundleId: appId,
    appPath: `${appOutDir}/${appName}.app`,
    appleId,
    // appleIdPassword: `@keychain:"Application Loader: ${appleId}"`
    appleIdPassword: process.env.APPLE_ID_PASS
  })
}
