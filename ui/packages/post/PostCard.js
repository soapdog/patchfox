const m = require("mithril")
const { getPref } = require("../../core/kernel/prefs.js")
const Card = require("../../core/components/Card.js")
const VoteCounter = require("../../core/components/VoteCounter.js")
const { when } = require("../../core/kernel/utils.js")
const PostCard = {
  oninit: (vnode) => {
    vnode.state.liked = false
    vnode.state.shouldLoadLikes = true

    let contentWarningsExpandByDefault = getPref(
      "content-warnings-expand",
      "collapsed"
    )

    vnode.state.showContentWarning =
      contentWarningsExpandByDefault === "collapsed"

    patchfox.listen(
      "prefs:changed:textSize",
      (newSize) => (vnode.state.textSize = newSize)
    )
  },
  view: (vnode) => {
    let msg = vnode.attrs.msg
    let content = ssb.markdown(msg.value.content.text)
    let showRaw = false
    let hasContentWarning = msg.value.content.contentWarning || false

    if (vnode.state.shouldLoadLikes) {
      ssb.votes(msg.key).then((ms) => {
        vnode.state.liked = ms.includes(ssb.feed)
        vnode.state.shouldLoadLikes = false
        m.redraw()
      })
    }

    const likeChanged = (ev) => {
      let v = ev.target.checked
      if (v) {
        ssb
          .like(msg.key)
          .then(() => {
            console.log("liked", msg.key)
            vnode.state.liked = true
            m.redraw()
          })
          .catch(() => (vnode.state.liked = false))
      } else {
        ssb
          .unlike(msg.key)
          .then(() => {
            console.log("unliked", msg.key)
            vnode.state.liked = false
            m.redraw()
          })
          .catch(() => (vnode.state.liked = true))
      }
      msg = msg
    }

    const reply = (ev) => {
      ev.preventDefault()
      let root = msg.value.content.root || msg.key
      let channel = msg.value.content.channel
      let replyfeed = msg.value.author
      patchfox.go("post", "compose", {
        root,
        branch: msg.key,
        channel,
        replyfeed,
      })
    }

    const fork = (ev) => {
      ev.preventDefault()
      let originalRoot = msg.value.content.root || msg.key
      let channel = msg.value.content.channel
      let replyfeed = msg.value.author
      patchfox.go("post", "compose", {
        root: msg.key,
        branch: msg.key,
        fork: originalRoot,
        channel,
        replyfeed,
      })
    }

    const goRoot = (ev) => {
      ev.preventDefault()
      let rootId = msg.value.content.root || msg.key
      patchfox.go("hub", "thread", { thread: rootId })
    }

    const goBranch = (ev) => {
      ev.preventDefault()
      let branchId = msg.value.content.branch || msg.key
      patchfox.go("hub", "thread", { thread: branchId })
    }

    vnode.state.textSize = getPref("textSize", "prose")

    const actions = [
      m("div.flex.align-middle", [
        m(
          ".form-control.flex-1",
          m("label.cursor-pointer.label", [
            m("span.label-text.mr-2", "Like"),
            m("input.toggle", {
              type: "checkbox",
              onchange: likeChanged,
              checked: vnode.state.liked,
            }),
          ])
        ),
        m(VoteCounter, { msg }),
      ]),
      m("div.flex-1"),
      when(
        msg.value.content.root,
        m(
          "span",
          m(
            "a.btn.btn-ghost",
            {
              href: `?pkg=hub&view=thread&thread=${encodeURIComponent(
                msg.value.content.root
              )}`,
              onclick: goRoot,
            },
            "Root Message"
          )
        )
      ),
      when(
        msg.value.content.branch,
        m(
          "span",
          m(
            "a.btn.btn-ghost",
            {
              href: `?pkg=hub&view=thread&thread=${encodeURIComponent(
                msg.value.content.branch
              )}`,
              onclick: goBranch,
            },
            "In Reply To"
          )
        )
      ),
      when(!msg.value.private, [
        m(
          "button.btn.btn-primary",
          {
            onclick: fork,
          },
          "Fork"
        ),
        m(
          "button.btn.btn-primary",
          {
            onclick: reply,
          },
          "Reply"
        ),
      ]),
    ]

    return m(
      Card,
      {
        msg,
        showRaw,
        actions,
      },
      [
        when(hasContentWarning && vnode.state.showContentWarning, [
          m("p", msg.value.content.contentWarning),
          m(
            "button.btn",
            {
              onclick: () => {
                vnode.state.showContentWarning = !vnode.state.showContentWarning
              },
            },
            "Show Message"
          ),
        ]),
        when(!vnode.state.showContentWarning, [
          when(
            hasContentWarning,
            m(
              "div.toast.toast-primary",
              m("p", [
                m("strong", "Content Warning:"),
                msg.value.content.contentWarning,
                m(
                  "button.btn-btn-sm.float-right",
                  {
                    onclick: () => {
                      vnode.state.showContentWarning = !vnode.state.showContentWarning
                    },
                  },
                  "Hide Message"
                ),
              ])
            )
          ),
          m("div.prose", { class: vnode.state.textSide }, m.trust(content)),
        ]),
        when(
          !hasContentWarning,
          m("div.prose", { class: vnode.state.textSide }, m.trust(content))
        ),
      ]
    )
  },
}

module.exports = PostCard
