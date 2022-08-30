const m = require("mithril")
const { getPref, setPref } = patchfox


const DisplayPreferences = {
  oninit: vnode => {},
  view: vnode => {
    let limit = getPref("limit", 10)
    let textSize = getPref("textSize", "prose")
    let composeSize = getPref("composeSize", "text")

    let setTextSize = (ev) => {
      let textSize = ev.target.value
      setPref("textSize", textSize)
      patchfox.emit("prefs:changed:textSize", textSize)
    }

    let setComposeSize = (ev) => {
      let textSize = ev.target.value
      setPref("composeSize", textSize)
    }

    let setLimit = ev => {
      setPref("limit", ev.target.value ?? 10)
    }

    const makeOptions = (options) => {
      return options.map(o => m("option", {
        class: o.class ?? "",
        value: o.value
      }, o.label))
    }

    const makeFormControl = (label, input) => {
      return m(".form-control.w-full", [
        m("label.label", m("span.label-text", label)),
        input
      ])
    }

    const makeSelect = (onchange, label, options) => {
      return makeFormControl(label,
        m("select.select.selectr-bordered.w-full.max-w-ws", {
          onchange
        }, makeOptions(options))
      )
    }

    const makeInput = (onchange, label, type = "text", value = "") => {
      return makeFormControl(label, 
        m("input.input.input-bordered", {
          value,
          type,
          onchange
        }))
    }

    return [
      m("h1.uppercase.font-medium.text-xl.mb-4", "Display Preferences"),
      makeSelect(setTextSize, "Text size for content", [
        {class: "prose", value: "prose", label: "Normal"},
        {class: "prose-lg", value: "prose-lg", label: "Large"},
        {class: "prose-xl", value: "prose-xl", label: "Extra Large"},
      ]),
      makeSelect(setComposeSize, "Text size for composing posts", [
        {class: "prose", value: "prose", label: "Normal"},
        {class: "prose-lg", value: "prose-lg", label: "Large"},
        {class: "prose-xl", value: "prose-xl", label: "Extra Large"},
      ]),
      makeInput(setLimit, "Messages per page", "number", limit)

    ]
  },
}

module.exports = DisplayPreferences
