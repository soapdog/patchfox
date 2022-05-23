const m = require("mithril")
const MessageDropdown = require("./MessageDropdown.js")
const MessageRaw = require("./MessageRaw.js")
const AvatarTile = require("./AvatarTile.js")
const { isMessageBlured } = require("../platforms/common/abusePrevention.js")

const Card = {
  oninit: (vnode) => {
    vnode.state.showRaw = vnode.attrs.showRaw || false
  },
  view: (vnode) => {

    let msg = vnode.attrs.msg

    let feed = msg.value.author
    let privateMsgForYou = false

    let border = false

    if (msg.value.private) {
      privateMsgForYou = true
    }

    let blured = isMessageBlured(msg)

    const goProfile = ev => {
      if (ev.ctrlKey) {
        window.open(
          `?pkg=contacts&view=profile&feed=${encodeURIComponent(feed)}#/profile`
        )
      } else {
        patchfox.go("contacts", "profile", { feed })
      }
    }

    const toggleRawMessage = () => {
      vnode.state.showRaw = !vnode.state.showRaw
    }

    const cardCss = () => {
      let classes = "card bordered shadow-2xl mb-8 bg-base-100 overflow-visible"

      if (blured) {
        classes += " blured"
      }

      if (privateMsgForYou) {
        classes += " border"
      }

      return classes
    }


    return m("div", {"class": cardCss()}, [
      m(".card-title",
        [
          m(".navbar",
            [
              m(".navbar-start", 
                m(".flex-none", 
                  m(AvatarTile, {
                    feed, 
                    time: msg.value.timestamp, 
                    onclick: goProfile
                  })
                )
              ),
              privateMsgForYou ?
                m(".navbar-center", 
                  m("span.label", 
                    "PRIVATE"
                  )
                ):
                "",
              m(".navbar-end",
                [
                  m("span", {"class":"text-gray channel-display",onclick:() => 
                  { patchfox.go("hub", "channel", { channel: msg.value.content.channel }) }},
                  msg.value.content.channel ? "#" + msg.value.content.channel : ""
                  ),
                  m(MessageDropdown, {
                    msg,
                    ontogglerawmessage:toggleRawMessage
                  }, 
                  )
                ]
              )
            ]
          )
        ]),
      m(".card-body",
        [
          !vnode.state.showRaw ?
            vnode.children :
            m(MessageRaw, {msg}), 
          m(".card-actions.justify-end", vnode.attrs.actions) 
                  
        ]
      )
    ]
    )
  }
}

module.exports = Card
