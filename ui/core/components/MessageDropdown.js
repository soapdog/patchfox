const m = require("mithril")
const MenuItem = require("./MenuItem.js")
const ssbUri = require("ssb-uri2")
const ipcRenderer = require("electron").ipcRenderer

const MessageDropdown = {
  oninit: (vnode) => {
    vnode.state.dropdownActive = false
  },
  view: (vnode) => {
    let msg = vnode.attrs.msg
    let showRaw = vnode.attrs.showRaw || false
    const ontogglerawmessage = vnode.attrs.ontogglerawmessage || false

    const toggleRawMessage = () => {
      ontogglerawmessage("toggleRawMessage")
      vnode.state.dropdownActive = false
    }

    const copyPermalink = () => {
      navigator.clipboard
        .writeText(ssbUri.fromMessageSigil(msg.key))
        .then(() => console.log("permalink copied"))
        .catch((err) => console.error("can't copy permalink", err))

      vnode.state.dropdownActive = false
    }

    const copyHash = () => {
      navigator.clipboard
        .writeText(`${msg.key}`)
        .then(() => console.log("hash copied"))
        .catch((err) => console.error("can't copy hash", err))

      vnode.state.dropdownActive = false
    }

    const openInNewTab = () => {
      vnode.state.dropdownActive = false
      console.log(msg)
      ipcRenderer.send("new-patchfox-window", {
        pkg: "hub",
        view: "thread",
        thread: msg.key
      })
    }

    const shareItem = () => {
      vnode.state.dropdownActive = false
      console.log(msg)
      ipcRenderer.send("share", ssbUri.fromMessageSigil(msg.key))
    }

    const menuRight = {
      "right": "0px !important;",
      "left": "unset !important;",
      "min-width": "300px;",
    }

    return m(".dropdown.dropdown-end.dropdown-hover", [
      m(
        "span.btn.btn-ghost.m-1",
        {
          tabindex: 0,
          class: vnode.state.dropdownActive ? "active" : "",
          onclick: () => {
            vnode.state.dropdownActive = !vnode.state.dropdownActive
          },
        },
        m("i.fas.fa-ellipsis-v")
      ),
      m(
        "ul.p-2.shadow.menu.dropdown-content.bg-base-100.rounded-box.w-80.z-40.text-sm.font-extralight",
        [
          m(MenuItem, {
            label: "Open In New Window",
            icon: "share",
            onclick: openInNewTab,
          }),
          m(MenuItem, {
            label: "Copy permalink to clipboard",
            icon: "copy",
            onclick: copyPermalink,
          }),
          m(MenuItem, {
            label: "Copy message id to clipboard",
            icon: "copy",
            onclick: copyHash,
          }),
          m(MenuItem, {
            label: "Share SSB URI",
            icon: "share",
            onclick: shareItem,
          }),
          m(".divider", "FOR THE CURIOUS"),
          m(MenuItem, {
            label: "Raw Message",
            icon: "message",
            onclick: toggleRawMessage,
          }),
        ]
      ),
    ])
  },
}

module.exports = MessageDropdown
