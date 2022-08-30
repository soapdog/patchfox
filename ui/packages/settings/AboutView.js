const m = require("mithril")

const blurb = `
# About Patchfox

This is an alpha version of Patchfox. 

At the moment it can only load the default
identity in your \`.ssb\` folder. Support for multiple identities and multiple
backends will be reinstated soon.
`

const AboutView = {
  oninit: vnode => {},
  view: vnode => {
    return m(".prose", m.trust(ssb.markdown(blurb)))
  },
}

module.exports = AboutView
