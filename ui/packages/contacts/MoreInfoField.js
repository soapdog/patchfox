const m = require("mithril")
const { when } = require("../../core/kernel/utils.js")

const MoreInfoField = {
  view: (vnode) => {
    let field = vnode.attrs.field || {
      name: "",
      type: "",
      value: "",
    }

    let index = vnode.attrs.index

    const deleteField = (ev) => {
      if (
        confirm(
          `Are you sure you want to remove ${field.type} ${field.name}: ${field.value}?`
        )
      ) {
        ondelete({ index })
      }
    }

    return m("tr", [
      m("td.column", field.name),
      m("td.column", field.type),
      m("td.column", [
        when(
          field.type == "URL",
          m(
            "a",
            {
              target: "_blank",
              href: field.value,
            },
            field.value
          )
        ),
        when(
          field.type == "email",
          m(
            "a",
            {
              target: "_blank",
              href: `mailto:${field.value}`,
            },
            field.value
          )
        ),
        when(
          field.type == "phone",
          m(
            "a",
            {
              target: "_blank",
              href: `tel:${field.value}`,
            },
            field.value
          )
        ),
        when(field.type == "text", m("span", field.value)),
      ]),
      m(
        "td.column",
        m(
          "button.btn-link",
          {
            onclick: deleteField,
          },
          "delete"
        )
      ),
    ])
  },
}

module.exports = MoreInfoField
