const m = require("mithril")
const MessageRenderer = require("../../core/components/MessageRenderer.js")
const {
  isChannelFiltered,
  addFilter,
  deleteFilter,
} = require("../../core/platforms/common/abusePrevention.js")

const ChannelView = {
  oninit: (vnode) => {
    vnode.state.msgs = []
    vnode.state.shouldLoadMessages = true
    vnode.state.subscribed = false
  },
  view: (vnode) => {
    let rootsOnly = false
    let channel = vnode.attrs.channel || false
    let lt = vnode.attrs.lt || false
    let hidden = isChannelFiltered(channel) || false

    if (!channel) {
      console.log("can't navigate to unnamed channel, going back to public")
      patchfox.go("hub") // force reload.
    }

    ssb.channelSubscribed(channel).then((s) => {
      vnode.state.subscribed = s
      m.redraw()
    })

    patchfox.title(`#${channel}`)

    let opts = {}

    if (lt) {
      opts.lt = lt
    }
    if (rootsOnly) {
      opts.rootsOnly = true
    } else {
      opts.rootsOnly = false
    }

    promise = ssb
      .channel(channel, opts)
      .then((ms) => {
        vnode.state.msgs = ms
        window.scrollTo(0, 0)
        vnode.state.shouldLoadMessages = false
      })
      .catch((n) => {
        if (!error) {
          console.error("errrrooooor", n)
        }
      })

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
        } else {
          // other thing
        }
      }

      const goNext = () => {
        let lt = vnode.state.msgs[vnode.state.msgs.length - 1].value.timestamp
        vnode.state.msgs = []
        patchfox.go("hub", "channel", {
          channel,
          lt,
        })
      }

      const goPrevious = () => {
        history.back()
      }

      const header = m(".navbar.mb-2.text-base-content", [
        m(
          ".navbar-start",
          m(
            "btn.btn-sm",
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
                onchange: subscriptionChanged,
              }),
            ])
          ),
          m(
            ".form-control",
            m("label.cursor-pointer.label", [
              m("span.label-text.px-2", "Roots Only"),
              m("input.toggle", {
                onchange: rootsOnlyChanged,
              }),
            ])
          ),
        ]),
      ])

      const spinner = m(
        ".flex.justify-center",
        m("fas.fa-spinner.fa-3x.fa-spin")
      )

      const messagesWithSpinner = vnode.state.shouldLoadMessages
        ? spinner
        : messagesLooper

      const messagesLooper =
        vnode.state.msgs.length == 0
          ? m("p", "No messages")
          : vnode.state.msgs.map((msg) => m(MessageRenderer, { msg }))

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
    }
  },
}

module.exports = ChannelView
