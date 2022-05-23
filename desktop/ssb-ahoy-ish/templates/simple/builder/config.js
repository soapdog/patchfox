// see https://www.electron.build/configuration/configuration

module.exports = {
  appId: 'com.simple-ahoy.app',
  directories: {
    output: 'installers'
  },

  /* Linux */
  linux: {
    category: 'Network',
    target: 'AppImage'
  },
  appImage: {
    artifactName: '${name}-Linux-${version}-${arch}.${ext}' // eslint-disable-line
  },

  /* Mac */
  mac: {
    category: 'public.app-category.social-networking'
  },
  dmg: {
    artifactName: '${name}-Mac-${version}.${ext}', // eslint-disable-line
  },

  /* Windows */
  win: {
  },
  nsis: {
    artifactName: '${name}-Windows-${version}.${ext}', // eslint-disable-line
  }
}
