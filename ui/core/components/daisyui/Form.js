const m = require("mithril")

const Form = {
  view: vnode => {
    let onsave = vnode.attrs.onsave
    let oncancel = vnode.attrs?.oncancel
    const onSubmit = ev => {
      ev.preventDefault()
      onsave()
    }
    
    return m("form.form", {onsubmit: onSubmit},[
      ...vnode.children,
      m("div.flex", [
        m("button.btn.flex-1.m-2", {
          onclick: oncancel
        }, "Cancel"),
        m("input.btn.btn-primary,flex-1.m-2", {
          type: "submit",
          class: vnode.attrs.submitting ? "loading" : "",
          value: "Save"
        })
      ])
    ])
  }
}

module.exports = Form
