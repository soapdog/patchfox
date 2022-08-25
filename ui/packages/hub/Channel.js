const m = require("mithril")
const MessageRenderer = require("../../core/components/MessageRenderer.js")
const Spinner = require("../../core/components/Spinner.js")

const {
  isChannelFiltered,
  addFilter,
  deleteFilter,
} = require("../../core/platforms/common/abusePrevention.js")

const ChannelView = {
  oninit: (vnode) => {
    vnode.state.msgs = []
    vnode.state.shouldLoadMessages = true
    vnode.state.shouldLoadStatus = true
    vnode.state.subscribed = false
    vnode.state.rootsOnly = false
    vnode.state.lt = []

    if (vnode.attrs.lt) {
      vnode.state.lt.push(vnode.attrs.lt)
    }
  },
  view: (vnode) => {
    let channel = vnode.attrs.channel || false
    let lt = vnode.state.lt
    let hidden = isChannelFiltered(channel) || false

    if (!channel) {
      console.log("can't navigate to unnamed channel, going back to public")
      patchfox.go("hub") // force reload.
    }

    if (vnode.state.shouldLoadStatus) {
      ssb.channelSubscribed(channel).then((s) => {
        vnode.state.subscribed = s
        vnode.state.shouldLoadStatus = false
        m.redraw()
      })
    }

    let opts = {}

    if (lt.length > 0) {
      opts.lt = lt[lt.length-1]
    }
    if (vnode.state.rootsOnly) {
      opts.rootsOnly = true
    } else {
      opts.rootsOnly = false
    }
    
    if (vnode.state.shouldLoadMessages) {
      ssb
        .channel(channel, opts)
        .then((ms) => {
          vnode.state.msgs = ms
          window.scrollTo(0, 0)
          vnode.state.shouldLoadMessages = false
          m.redraw()
        })
        .catch((n) => {
          if (!error) {
            console.error("errrrooooor", n)
          }
        })
    }

    patchfox.title(`#${channel}`)

    const subscriptionChanged = (ev) => {
      let v = ev.target.checked
      if (v) {
        ssb.channelSubscribe(channel).catch(() => {
          vnode.state.subscribed = false
          m.redraw()
        })
      } else {
        ssb.channelUnsubscribe(channel).catch(() => {
          vnode.state.subscribed = true
          m.redraw()
        })
      }
    }

    const hideChanged = (ev) => {
      let v = ev.target.checked
      if (v) {
        addFilter({
          action: "hide",
          channel,
        })
      } else {
        deleteFilter({
          action: "hide",
          channel,
        })
      }
      location.reload()
    }

    const rootsOnlyChanged = (ev) => {
      let v = ev.target.checked
      if (v) {
        // something
        vnode.state.rootsOnly = true
      } else {
        // other thing
        vnode.state.rootsOnly = false
      }

      vnode.state.shouldLoadMessages = true
      vnode.state.msgs = []
    }

    const goNext = () => {
      let tstamp = vnode.state.msgs[vnode.state.msgs.length - 1].value.timestamp
      vnode.state.msgs = []
      vnode.state.shouldLoadMessages = true
      vnode.state.lt.push(tstamp)
    }

    const goPrevious = () => {
      vnode.state.msgs = []
      vnode.state.shouldLoadMessages = true
      vnode.state.lt.pop()
    }

    const header = m(".navbar.mb-2.text-base-content", [
      m(
        ".navbar-start",
        m(
          "a.btn.btn-sm",
          {
            href: patchfox.url("post", "compose", { channel }),
            onclick: (ev) => {
              ev.preventDefault()
              patchfox.go("post", "compose", { channel })
            },
          },
          "New Post"
        )
      ),
      m(".navbar-end", [
        m(
          ".form-control",
          m("label.cursor-pointer.label", [
            m("span.label-text.px-2", "Hide Channel"),
            m("input.toggle", {
              type: "checkbox",
              onchange: hideChanged,
            }),
          ])
        ),
        m(
          ".form-control",
          m("label.cursor-pointer.label", [
            m("span.label-text.px-2", "Subscribe"),
            m("input.toggle", {
              type: "checkbox",
              checked: vnode.state.subscribed,
              onchange: subscriptionChanged,
            }),
          ])
        ),
        m(
          ".form-control",
          m("label.cursor-pointer.label", [
            m("span.label-text.px-2", "Roots Only"),
            m("input.toggle", {
              type: "checkbox",
              onchange: rootsOnlyChanged,
            }),
          ])
        ),
      ]),
    ])

    const messagesLooper =
      vnode.state.msgs.length == 0
        ? m("p", "No messages")
        : vnode.state.msgs.map((msg) => m(MessageRenderer, { msg }))

    const messagesWithSpinner = vnode.state.shouldLoadMessages
      ? m(Spinner)
      : messagesLooper

    const pagination = [
      m("br"),
      m(".btn-group", [
        m(
          "button.btn.btn-outline.btn-wide",
          { onclick: goPrevious },
          "Previous"
        ),
        m("button.btn.btn-outline.btn-wide", { onclick: goNext }, "Next"),
      ]),
    ]

    return [
      header,
      isChannelFiltered(channel)
        ? m("p", "This channel is being filtered.")
        : messagesWithSpinner,
      pagination,
    ]
  },
}

module.exports = ChannelView
