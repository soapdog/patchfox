const m = require("mithril")
const { when, idFromLabel } = require("../../kernel/utils.js")

const TextInput = {
  view: vnode => {
    return m(".form-control", [
      m("label.label", [m("span.label-text", vnode.attrs.label), when(vnode.attrs?.topAltText, m("span.label-text-alt", vnode.attrs.topAltText))]),
      m("input", {
        class: "input input-bordered",
        id: vnode.attrs?.id || idFromLabel(vnode.attrs.label),
        onchange: vnode.attrs?.onchange,
        value: vnode.attrs?.value,
        placeholder: vnode.attrs?.placeholder || vnode.attrs.label,
      }),
      when(vnode.attrs?.remarks, m("label.label", [m("span.label-text-alt", vnode.attrs.remarks)])),
    ])
  },
}

module.exports = TextInput
