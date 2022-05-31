const m = require("mithril")
const { when } = require("../../core/kernel/utils.js")

const ErrorView = {
  view: (vnode) => {
    patchfox.title(`Oops!`)

    let error = vnode.attrs.message || {}
    let currentPackage = vnode.attrs.currentPackage || {}
    let errorObj = {}
    let toastClass = ""
    let toast = false
    let msg
    let cta = false

    console.log(error)

    if (typeof error == "object") {
      errorObj = error
      error = errorObj.message
    }

    let errorMapping = {
      "Error: stream is closed": {
        label: "Want to try to reconnect?",
        action: () => console.log("action!"),
      },
    }

    if (errorMapping.hasOwnProperty(error)) {
      cta = errorMapping[error]
    }

    return m(".prose", [
      m(
        "h2.uppercase.text-sl.font-medium",
        "😿 An Error Has Occurred, sorry 😭"
      ),
      m("h4.font-medium", "This is what we know about it"),
      when(
        currentPackage.hasOwnProperty("name"),
        m("p", `It has happened in package: ${currentPackage.name}.`)
      ),
      m("pre.code", error),
      m("p", "You might want to:"),
      m("ul", [
        when(
          cta,
          m(
            "li",
            m(
              "a",
              {
                onclick: cta.action,
              },
              cta.label
            )
          )
        ),
        m(
          "li",
          m(
            "a",
            {
              target: "_blank",
              href: patchfox.docsUrl("/troubleshooting/"),
            },
            "Open our troubleshooting documentation."
          )
        ),
        m("li", [
          m(
            "a",
            {
              target: "_blank",
              href: "https://github.com/soapdog/patchfox/issues",
            },
            "Create an issue report"
          ),
          " on the Patchfox issue tracker.",
        ]),
      ]),
      when(currentPackage.hasOwnProperty("name"), [
        m("p", "Do you want to see the source code for the current package?"),
        m(
          "li",
          m(
            "a.link.link-primary",
            {
              href: patchfox.docsUrl(
                `/packages/${currentPackage.name}/README.md`
              ),
              target: "_blank",
            },
            `View documentation for package ${currentPackage.name}`
          )
        ),
        m(
          "li",
          m(
            "a.link.link-primary",
            {
              href: `https://github.com/soapdog/patchfox/tree/master/src/packages/${currentPackage.name}`,
              target: "_blank",
            },
            `View source-code for package ${currentPackage.name} on GitHub`
          )
        ),
        m(
          "li",
          m(
            "a.link.link-primary",
            {
              href: `https://git.sr.ht/~soapdog/patchfox/tree/master/item/src/packages/${currentPackage.name}`,
              target: "_blank",
            },
            `View source-code for package ${currentPackage.name} on SourceHut.`
          )
        ),
      ]),
    ])
  },
}

module.exports = ErrorView
