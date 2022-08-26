const m = require("mithril")
const Spinner = require("../../core/components/Spinner.js")

const settingsBlurb = `
This is an alpha version of Patchfox. At the moment it can only load the default
identity in your \`.ssb\` folder. Support for multiple identities and multiple
backends will be reinstated soon.
`


const StatusView = {
  oninit: (vnode) => {
  },
  view: (vnode) => {
   
    return m(".prose", [
      m("h1", "Settings"),
      m.trust(ssb.markdown(settingsBlurb))
    ])
  },
}

module.exports = StatusView
