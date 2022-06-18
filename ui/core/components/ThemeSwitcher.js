const m = require("mithril")
const ThemeSwitcher = {
  view: (vnode) => {
    let themes = [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
    ]

    let currentTheme = patchfox.getPref("theme", "light")

    const setTheme = (theme) => {
      patchfox.setPref("theme", theme)
      document.documentElement.setAttribute("data-theme", theme)
      m.redraw()
    }

    return m(".dropdown.dropdown-end", [
      m(
        ".m-1.btn.btn-ghost",
        {
          tabindex: 0,
        },
        m("i.fas.fa-swatchbook")
      ),
      m(
        "ul.p-2.shadow.menu.dropdown-content.bg-accent.rounded-box.w-52.text-accent-content",
        {
          tabindex: 0,
        },
        themes.map((theme) => {
          const b1 = m(
            "button.btn.btn-ghost.btn-disabled",
            {
              disabled: true,
            },
            theme
          )
          const b2 = m("button.btn.btn-ghost", {
            onclick: (ev) => {
              setTheme(theme)
            },
          }, theme)
          return currentTheme == theme ? b1 : b2
        })
      ),
    ])
  },
}

module.exports = ThemeSwitcher
