const m = require("mithril")
const { when, idFromLabel } = require("../../kernel/utils.js")

const TextArea = {
  view: vnode => {
    return m(".form-control", [
      m("label.label", [m("span.label-text", vnode.attrs.label), when(vnode.attrs?.topAltText, m("span.label-text-alt", vnode.attrs.topAltText))]),
      m(
        "textarea",
        {
          class: "textarea textarea-bordered h-80",
          id: vnode.attrs?.id || idFromLabel(vnode.attrs.label),
          onchange: vnode.attrs?.onchange,
        },
        vnode.attrs?.value
      ),
      when(vnode.attrs?.remarks, m("label.label", [m("span.label-text-alt", vnode.attrs.remarks)])),
    ])
  },
}

module.exports = TextArea
