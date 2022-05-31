const m = require("mithril")
const keymage = require("keymage")

const LauncherView = {
  oninit: (vnode) => {
    vnode.state.active = vnode.attrs.active || false
    vnode.state.subView = vnode.attrs.subView || "Apps"

    let removeHotKey = keymage(
      "ctrl-m",
      () => {
        keymage.pushScope("launcher")
        vnode.state.active = !vnode.state.active
        vnode.state.descriptionOpen = false 
        vnode.state.subView = "Apps"
        m.redraw()
      },
      { preventDefault: true }
    )

    const token = patchfox.listen("launcher:open", () => {
      active = true
      console.log("open launcher")
    })
  },
  view: (vnode) => {
    let packageBeingHovered = false
    let description = ""
    let descriptionOpen = false
    let selectedPackage = false

    let packageKeys = []

    const iconForPackage = (pkg) => {
      let icon = "assets/images/package.svg"
      if (patchfox.packages[pkg].icon) {
        icon = `packages/${pkg}/assets/${patchfox.packages[pkg].icon}`
      }
      return icon
    }

    const titleForPackage = (pkg) => {
      let name = patchfox.packages[pkg]?.title || patchfox.packages[pkg].name
      return name
    }

    const descriptionForPackage = (pkg) => {
      let description = patchfox.packages[pkg].description || false
      return description
    }

    const urlForPackage = (pkg) => {
      let url = `?pkg=${pkg}`
      return url
    }

    const filter = (key) => {
      switch (key) {
        case "All Packages":
          packageKeys = Object.keys(patchfox.packages)
          break
        case "Apps":
          packageKeys = Object.keys(patchfox.packages).filter((pkg) => {
            return (
              patchfox.packages[pkg].app && patchfox.packages[pkg].app === true
            )
          })
          break
        default:
          packageKeys = []
      }
      vnode.state.subView = key
    }

    filter(vnode.state.subView)

    const makeTab = (view) => {
      return m("a", {
        href: "#",
        class: vnode.state.subView == view ? "tab tab-active" : "tab",
        onclick: () => filter(view),
      }, view)
    }

    const makePackage = (pkg) => {
      return m(
        "div",
        {
          "class": descriptionForPackage(pkg)
            ? "package c-hand tooltip"
            : "package c-hand",
          "data-tooltip": descriptionForPackage(pkg),
          "onclick": () => {
            if (patchfox.packages[pkg]?.app) {
              vnode.state.active = false
              patchfox.go(pkg, "view")
            } else {
              vnode.state.selectedPackage = pkg
              vnode.state.descriptionOpen = true
            }
          },
        },
        [
          m(
            ".package-icon",
            m("img.centered", {
              src: iconForPackage(pkg),
              alt: titleForPackage(pkg),
            })
          ),
          m(
            ".package-content",
            m(
              "a.package-title",
              {
                href: urlForPackage(pkg),
              },
              titleForPackage(pkg)
            )
          ),
        ]
      )
    }

    return m(
      "div",
      { class: vnode.state.active ? "modal modal-open" : "modal" },
      m(".modal-box.w-11/12.max-w.5xl", [
        m("a.modal-overlay", {
          href: "#close",
          onclick: () => (vnode.state.active = false),
        }),
        m(".modal-container", [
          m(".modal-header", [
            m(
              "a.btn.btn-ghost.float-right",
              {
                href: "#close",
                onclick: () => (vnode.state.active = false),
              },
              m("i.fas.fa-times")
            ),
            m("h1.uppercase.font-medium.text-center.mb-4", "Launcher"),
          ]),
          m("div", { class: vnode.state.descriptionOpen ? "hidden" : "" }, [
            m(".tabs.tabs-boxed.mb-4", [
              makeTab("Apps"),
              makeTab("All Packages"),
            ]),
            m(
              ".grid",
              packageKeys.map((p) => makePackage(p))
            ),
          ]),
          m("div", { class: !vnode.state.descriptionOpen ? "hidden" : "" }, [
            m("p", "description for package"),
          ]),
        ]),
      ])
    )
  },
}
module.exports = LauncherView
