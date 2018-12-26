import m from "mithril";

const AppShell = {
  view: function (vnode) {
    return m("main.layout", [
      m("nav.menu", [
        m("h1.brand", "Patchfox"),
        m("a", {
          href: '/public',
          oncreate: m.route.link
        }, "Public"),
        m("a", {
          href: '/profile',
          oncreate: m.route.link
        }, "Profile"),
        m("span.spacer"),
        m("a", {
          href: '/setup',
          oncreate: m.route.link
        }, "Setup")
      ]),
      m("section.content", vnode.children)
    ])
  }
}

export default AppShell;