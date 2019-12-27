const m = require("mithril");
const Stream = require("mithril/stream")
const Menu = require("./menu.js");
// const IdentityAndConnection = require("./IdentityAndConnection.js");
// const DisplayPreferences = require("./DisplayPreferences.js");
// const Filters = require("./Filters.js");
// const ContentWarnings = require("./ContentWarnings.js");
// const PlatformDAT = require("./PlatformDAT.js");
// const PlatformIPFS = require("./PlatformIPFS.js");
const About = require("./about.js");

const views = {
    // identityAndConnection: IdentityAndConnection,
    // displayPreferences: DisplayPreferences,
    // filters: Filters,
    // contentWarnings: ContentWarnings,
    // platformDAT: PlatformDAT,
    // platformIPFS: PlatformIPFS,
    about: About
};

require("./style.css")

class Settings {
    constructor(vnode) {
        let key = vnode.attrs.subView || "about"
        if (!views.hasOwnProperty(key)) {
            console.error(`no view ${key}`)
            key = "about"
        }
        this.subView = Stream(key)
    }

    view() {
        console.log("subView", this.subView())
        let key = this.subView()
        if (!views.hasOwnProperty(key)) {
            console.error(`no view ${key}, reverting to about.`)
            key = "about"
        }
        return m(".columns", [
            m(".column.col-auto",
                m(Menu, { subView: this.subView })
            ),
            m(".column", m(views[key]))
        ])
    }
}

module.exports = Settings