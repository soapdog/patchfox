const m = require("mithril")
const Card = require("../../core/components/Card.js")
const { when } = require("../../core/kernel/utils.js")
const AboutCard = {
  oninit: (vnode) => {
    let msg = vnode.attrs.msg
    vnode.state.person = msg.value.author
    vnode.state.otherName = msg.value.content.name || msg.value.content.about

    ssb.avatar(msg.value.author).then((data) => {
      vnode.state.person = data.name
      m.redraw()
    })

    if (vnode.state.otherName === msg.value.content.about) {
      ssb.avatar(msg.value.content.about).then((data) => {
        vnode.state.otherName = data.name
        m.redraw()
      })
    }
  },
  view: (vnode) => {
    let msg = vnode.attrs.msg
    let otherLink = encodeURIComponent(msg.value.content.about)
    let isThisAboutFeeds = true
    let showRaw = false
    let person = vnode.state.person
    let otherName = vnode.state.otherName
    let verb =
      msg.value.content.about === msg.value.author
        ? "self-identifies"
        : "identifies"

    let image = false

    if (msg.value.content.image) {
      switch (typeof msg.value.content.image.link) {
        case "string":
          image = patchfox.httpUrl(
            `/blobs/get/${encodeURIComponent(msg.value.content.image.link)}`
          )
          break
        case "function":
          // eslint-disable-next-line no-case-declarations
          image = patchfox.httpUrl(
            `/blobs/get/${encodeURIComponent(msg.value.content.image)}`
          )
      }
    }

    if (msg.value.content.description) {
      verb += " with description"
    }

    if (msg.value.content.about.startsWith("%")) {
      isThisAboutFeeds = false // this appear to be a gathering
    }

    const imageOrName = image
      ? [
          m(
            ".avatar",
            m(
              ".m-2.w-14.h-14.mask.mask-squircle",
              m("img", {
                src: image,
                alt: otherName,
              })
            )
          ),
          m(".tile-content", m(".tile-title", otherName)),
        ]
      : m("span", otherName)

    return m(
      Card,
      {
        msg,
        showRaw,
      },
      [
        m(
          "div.flex.flex-row.cursor-pointer",
          {
            onclick: () =>
              patchfox.go("contacts", "profile", { feed: otherLink }),
          },
          imageOrName
        ),
        when(
          msg.value.content?.description,
          m(
            "article.prose.mt-2",
            m.trust(ssb.markdown(msg.value.content.description))
          )
        ),
      ]
    )
  },
}

module.exports = AboutCard
