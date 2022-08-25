const m = require("mithril")

const Form = {
  view: vnode => {
    let onSave = vnode.attrs.onSave
    let onCancel = vnode.attrs?.onCancel ? vnode.attrs.onCancel : onCancelDefault

    const onSubmit = ev => {
      ev.preventDefault()
      onSave()
    }

    const onCancelDefault = ev => {
      ev.preventDefault
    }
    
    return m("form.form", {onsubmit: onSubmit},[
      ...vnode.children,
      m("div.flex", [
        m("button.btn.flex-1.mt-2", {
          onclick: onCancel
        }, "Cancel"),
        m("input.btn.btn-primary.flex-1.mt-2.ml-2", {
          type: "submit",
          class: vnode.attrs.submitting ? "loading" : "",
          value: "Save"
        })
      ])
    ])
  }
}

module.exports = Form
