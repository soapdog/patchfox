const m = require("mithril")
const { getPref, setPref, setMessageTypeVisibility, getVisibilityForMessageType } = patchfox
const _ = require("lodash")

const messageBlurb = `
Select which message types you'd like to see based on your 
relationship graph.
`

const DisplayPreferences = {
  oninit: vnode => {},
  view: vnode => {
    let limit = getPref("limit", 10)
    let textSize = getPref("textSize", "prose")
    let composeSize = getPref("composeSize", "text")

    let setTextSize = ev => {
      let textSize = ev.target.value
      setPref("textSize", textSize)
      patchfox.emit("prefs:changed:textSize", textSize)
    }

    let setComposeSize = ev => {
      let textSize = ev.target.value
      setPref("composeSize", textSize)
    }

    let setLimit = ev => {
      setPref("limit", ev.target.value ?? 10)
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

    const makeFormControl = (label, input) => {
      return m(".form-control.w-full", [m("label.label", m("span.label-text", label)), input])
    }

    const makeSelect = (onchange, label, options) => {
      return makeFormControl(
        label,
        m(
          "select.select.select-bordered.w-full.max-w-ws",
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

    const makeCheckbox = (onchange, label) => {
      return m("input.checkbox", {
        onchange,
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

    let messageTypeRows = []
    let seenTypes = new Set()

    let packagesWithMessageTypes = _.filter(patchfox.packages, p => p.messageTypes)

    packagesWithMessageTypes.forEach(pkg => {
      let mts = pkg.messageTypes

      mts.forEach(mt => {
        if (seenTypes.has(mt.type)) {
          return
        }

        seenTypes.add(mt.type)

        const setPrefForType = relationship => {
          return function (ev) {
            let v = ev.target.value
            if (v) {
              setMessageTypeVisibility(mt.type, relationship)
            }
          }
        }

        const getVisibilityBasedOnRelationshipAndType = (relationship, type) => {
          return getVisibilityForMessageType(type) === relationship
        }

        messageTypeRows.push(m("tr", [
          m("th", mt.type), 
          m("td", makeRadio(setPrefForType("friends"),mt.type, getVisibilityBasedOnRelationshipAndType("friends", mt.type))),
          m("td", makeRadio(setPrefForType("following"),mt.type, getVisibilityBasedOnRelationshipAndType("following", mt.type))),
          m("td", makeRadio(setPrefForType("all"), mt.type, getVisibilityBasedOnRelationshipAndType("all", mt.type))),
          m("td", makeRadio(setPrefForType("hide"), mt.type, getVisibilityBasedOnRelationshipAndType("hide", mt.type)))
        ]))
      })
    })

    return [
      m("h1.uppercase.font-medium.text-xl.mb-4", "Display Preferences"),
      makeSelect(setTextSize, "Text size for content", [
        { class: "prose", value: "prose", label: "Normal" },
        { class: "prose-lg", value: "prose-lg", label: "Large" },
        { class: "prose-xl", value: "prose-xl", label: "Extra Large" },
      ]),
      makeSelect(setComposeSize, "Text size for composing posts", [
        { class: "prose", value: "text", label: "Normal" },
        { class: "prose-lg", value: "text-lg", label: "Large" },
        { class: "prose-xl", value: "text-xl", label: "Extra Large" },
      ]),
      makeInput(setLimit, "Messages per page", "number", limit),
      m("h2.uppercase.font-medium.text-lg.mt-4", "Message Types"),
      m(".prose", m.trust(ssb.markdown(messageBlurb))),
      m("table.table.w-full", [
        m("thead", [
          m("th", "Message Type"), 
          m("th", "Friends"), 
          m("th", "Following"), 
          m("th", "Everyone"),
          m("th", "Hide"),
        ]), m("tbody", messageTypeRows)]),
    ]
  },
}

module.exports = DisplayPreferences
