const m = require("mithril")

const Spinner = {
  view: (vnode) => {
    return m(".flex.justify-center",
    m("i.fas.fa-spinner.fa-3x.fa-spin"))
  }
}

module.exports = Spinner
