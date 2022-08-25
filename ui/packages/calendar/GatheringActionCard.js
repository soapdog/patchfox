const m = require("mithril")
const AvatarChip = require("../../core/components/AvatarChip.js")
const Scuttle = require("scuttle-gathering")
const gathering = Scuttle(ssb.sbot)

const GatheringActionCard = {
  oninit: vnode => {
    let msg = vnode.attrs.msg
    vnode.state.expression = false
    vnode.state.msgid = msg.value.content.about
    vnode.state.encodedid = encodeURIComponent(vnode.state.msgid)
    vnode.state.label = vnode.state.msgid
    vnode.state.person = msg.value.author

    gathering.get(vnode.state.msgid, (err, data) => {
      if (!err) {
        vnode.state.event = data
        vnode.state.label = vnode.state.event.title || vnode.state.event.description.slice(0, 100) + "..."
        m.redraw()
      }
    })


    ssb.avatar(msg.value.author).then(data => {
      vnode.state.person = data.name
      m.redraw()
    })

  },
  view: vnode => {
    let msg = vnode.attrs.msg

    if (msg.value.content.attendee && msg.value.content.attendee.link) {
      vnode.state.expression = "attending"
      vnode.state.person = msg.value.content.attendee.link
    }

    if (msg.value.content.notAttendee && msg.value.content.notAttendee.link) {
      vnode.state.expression = "not attending"
      vnode.state.person = msg.value.content.notAttendee.link
    }

    if (msg.value.content.image) {
      vnode.state.expression = "changed the image for"
    }

    if (!vnode.state.expression) {
      vnode.state.expression = "made changes to"
    }

    const goThread = ev => {
      ev.stopPropagation()
      ev.preventDefault()
      if (typeof vnode.state.msgid === "undefined") {
        throw "Can't go to undefined message id"
      }
      if (ev.ctrlKey) {
        window.open(`?pkg=hub&view=thread&thread=${encodeURIComponent(vnode.state.msgid)}`)
      } else {
        patchfox.go("calendar", "gathering", { msgid: vnode.state.msgid })
      }
    }

    return m(".flex.m-2", [
      m(AvatarChip, {feed: msg.value.author, arrow: true}),
      m("p.m-2", [
        vnode.state.expression,
        m("a.ml-2",{
          href: patchfox.url("calendar","gathering", {gathering: vnode.state.msgid}),
          onclick: goThread
        },vnode.state.label)
      ])
    ])
  },
}

module.exports = GatheringActionCard
