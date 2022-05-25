const m = require("mithril")
const { when } = require("../../core/kernel/utils.js")
const JoinPubView = {
  oninit: (vnode) => {
    vnode.state.error = false
    vnode.state.msg = ""
    vnode.state.joining = false
    vnode.state.invite = vnode.attrs.invite || ""
  },
  view: (vnode) => {
    const joinPub = (ev) => {
      ev.preventDefault()
      vnode.state.error = false
      vnode.state.msg = ""
      vnode.state.joining = true
      ssb.system
        .acceptInvite(vnode.state.invite)
        .catch((err) => {
          vnode.state.joining = false
          vnode.state.error = true
          vnode.state.msg = JSON.stringify(err, null, 4)
          m.redraw()
        })
        .then((result) => {
          vnode.state.joining = false
          vnode.state.msg = JSON.stringify(result, null, 4)
          m.redraw()
        })
    }

    return [
      m("h1.title", "Join Pub"),
      m("form.form", { onsubmit: joinPub }, [
        m(".form-control.w-full.max-w-xs", [
          m(
            "label.label",
            {
              for: "invite-code",
            },
            m(".label-text","Invite Code")
          ),
          m("input.input.input-bordered", {
            type: "text",
            id: "invite-code",
            placeholder: "Invite code...",
            onchange: (ev) => {
              vnode.state.invite = ev.target.value
            },
          }),
          m(
            "button.btn.btn-primary.mt-2",
            {
              onclick: joinPub,
              class: vnode.state.joining ? "loading" : "",
              disabled: vnode.state.joining,
            },
            "Join Pub"
          ),
        ]),
      ]),
      when(vnode.state.msg.length > 0, m(".container", m("pre.code.join-room", m.trust(vnode.state.msg)))),
    ]
  },
}

module.exports = JoinPubView
