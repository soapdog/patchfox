/**
 * I had some ideas for application-wide preferences, but I don't think they're
 * more important than some missing features I need to implement right away. So,
 * I'm gonna leave this file here and comment out the menu entry from `SettingsView.js`
 * so that user's are not confusing.
 */

const m = require("mithril")
const { getPref, setPref, setMessageTypeVisibility, getVisibilityForMessageType } = patchfox
const _ = require("lodash")

const quickAccessBlurb = `
Select which features should show on the quick-access menu at the top of Patchfox window.
`

const ApplicationPreferences = {
  oninit: vnode => {},
  view: vnode => {
    let skipTaskbar = getPref("skipTaskbar", false)

    let setShowOnTaskbar = ev => {
      let skip = ev.target.checked
      setPref("skipTaskbar", skip)
    }

    const makeOptions = options => {
      return options.map(o =>
        m(
          "option",
          {
            class: o.class ?? "",
            value: o.value,
          },
          o.label
        )
      )
    }

    const makeFormControl = (label, input, inside = false) => {
      if (inside) {
        return m(".form-control.w-full", [m("label.label", m("span.label-text", label), input)])
      } else {
        return m(".form-control.w-full", [m("label.label", m("span.label-text", label)), input])
      }
    }

    const makeSelect = (onchange, label, options) => {
      return makeFormControl(
        label,
        m(
          "select.select.selectr-bordered.w-full.max-w-ws",
          {
            onchange,
          },
          makeOptions(options)
        )
      )
    }

    const makeInput = (onchange, label, type = "text", value = "") => {
      return makeFormControl(
        label,
        m("input.input.input-bordered", {
          value,
          type,
          onchange,
        })
      )
    }

    const makeCheckbox = (onchange, checked = true) => {
      return m("input.checkbox.toggle", {
        onchange,
        checked,
        type: "checkbox",
      })
    }


    const makeRadio = (onchange, name, checked = false) => {
      return m("input.radio", {
        onchange,
        name,
        checked,
        type: "radio",
      })
    }

    const makeToggle = (onchange, label, checked) => {
      return makeFormControl(label, makeCheckbox(onchange, checked), true)
    }



    return [
      m("h1.uppercase.font-medium.text-xl.mb-4", "Application Preferences"),
      makeToggle(setShowOnTaskbar, "Hide from taskbar", skipTaskbar),
      m("p.prose", m.trust(ssb.markdown(quickAccessBlurb)))
    ]
  },
}

module.exports = ApplicationPreferences
