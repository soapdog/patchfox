const m = require("mithril")
const MessageDropdown = require("../MessageDropdown.js")
const MessageRaw = require("../MessageRaw.js")
const AvatarTile = require("../AvatarTile.js")
const { isMessageBlured } = require("../../platforms/common/abusePrevention.js")

const Card = {
  view: (vnode) => {

    let msg = vnode.attrs.msg
    let showRaw = vnode.attrs.showRaw || false

    let feed = msg.value.author
    let privateMsgForYou = false

    let border = false
    let dropdownActive = false

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
      showRaw = !showRaw
      dropdownActive = false
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
                  m(MessageDropdown, {ontogglerawmessage:toggleRawMessage}, 
                  )
                ]
              )
            ]
          )
        ]),
      m(".card-body",
        [
          !showRaw ?
            vnode.children :
            m(MessageRaw, {msg}), 
          m(".card-actions", vnode.attrs.actions) 
                  
        ]
      )
    ]
    )
  }
}

module.exports = Card
