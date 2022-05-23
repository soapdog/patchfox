const m = require("mithril")
const MenuItem = require("./ui/MenuItem.svelte")
const ssbUri = require("ssb-uri2")

const MessageDropdown = {
  view: (vnode) => {
  
    let msg = vnode.attrs.msg
    let showRaw = vnode.attrs.showRaw || false
    const onclick = vnode.attrs.onclick || false
  
    let dropdownActive = false
  
    const toggleRawMessage = () => {
      onclick("toggleRawMessage")
    }
  
    const copyPermalink = () => {
      navigator.clipboard
        .writeText(ssbUri.fromMessageSigil(msg.key))
        .then(() => console.log("permalink copied"))
        .catch(err => console.error("can't copy permalink", err))
  
      dropdownActive = false
    }
  
    const copyHash = () => {
      navigator.clipboard
        .writeText(`${msg.key}`)
        .then(() => console.log("hash copied"))
        .catch(err => console.error("can't copy hash", err))
  
      dropdownActive = false
    }
  
    const openInNewTab = () => {
      dropdownActive = false
      window.open(`/index.html?pkg=hub&view=thread&thread=${encodeURIComponent(msg.key)}`)
    }
    
    const menuRight = {
      right: "0px !important;",
      left: "unset !important;",
      "min-width": "300px;"
    }
    
    return m(".dropdown.dropdown-end.dropdown-hover", [
      m("span.btn.btn-ghost.m-1", {
        tabindex: 0, 
        classes: dropdownActive ? "active" : "",
        onclick: () => {dropdownActive = !dropdownActive}
      }, m("i.fas.fa-ellipsis-v")),
      m("ul.p-2.shadow.menu.dropdown-content.bg-base-100.rounded-box.w-80.z-40.text-sm.font-extralight", [
        m(MenuItem, {
          label: "Open In New Tab"
          icon: "share"
          link: "?pkg=hub&view=thread&thread={encodeURIComponent(msg.key)}"
          onclick: openInNewTab
        }),
        m(MenuItem, {
          label: "Copy permalink to clipboard"
          icon: "copy"
          onclick: copyPermalink
        },
        m(MenuItem, {
          label: "Copy message id to clipboard"
          icon: "copy"
          onclick: copyHash
        },
        m(".divider", "FOR THE CURIOUS"),
        m(MenuItem, {
          label: "Raw Message"
          icon: "message"
          onclick: toggleRawMessage
        }
      ])
    ])
  } 
}

module.exports = MessageDropdown
