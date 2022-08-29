const m = require("mithril")
const MessageRenderer = require("../../core/components/MessageRenderer.js")
const Spinner = require("../../core/components/Spinner.js")

const ThreadView = {
  oninit: (vnode) => {
    vnode.state.shouldLoadMessages = true
    vnode.state.msgs = []
    vnode.state.error = false
    vnode.state.scrolledIntoView = false
  },
  onupdate: vnode => {
    let thread = vnode.attrs.thread
    let el = document.querySelector(`[data-key='${thread}']`)

    if (el && !vnode.state.scrolledIntoView) {
      console.log("scrolling")
      el.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
      vnode.state.scrolledIntoView = true
    } else {
      console.log("not", el)
    }

  },
  view: (vnode) => {
    let thread = vnode.attrs.thread

    if (vnode.state.shouldLoadMessages) {
      console.log("attempting to load", thread)
      if (thread.startsWith("ssb:")) {
        thread = thread.replace("ssb:", "")
      }
      
      patchfox.title(thread)

      ssb
        .thread(thread)
        .then((ms) => {
          vnode.state.msgs = ms
          vnode.state.shouldLoadMessages = false
          m.redraw()
        })
        .catch((n) => {
          console.dir(n)
          vnode.state.error = n.message
          vnode.state.shouldLoadMessages = false
          if (n.message.indexOf("stream is closed") !== -1) {
            location.reload()
          }
          m.redraw()
        })
    }

    const errorDisplay = [m(
      ".toast.toast-error",
      m.trust(`
      Couldn't load thread
      <a href="?thread=${thread}#/thread">${thread}</a>
      : ${vnode.state.error}  
      `)),
      m("button.btn.btn-primary.mt-2", {
        onclick: () => history.back()
      }, "Go back")
    ]

    const messagesOrSpinner =
      vnode.state.msgs.length == 0
        ? m(Spinner)
        : vnode.state.msgs.map((msg) => m(MessageRenderer, { msg }))

    return vnode.state.error ? errorDisplay : messagesOrSpinner
  },
}

module.exports = ThreadView
