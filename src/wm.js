const { getPref } = require("./core/kernel/prefs.js");
const m = require("mithril");
const queryString = require("query-string");

require("./wm.css");

class WM {
    constructor() {
        this.useShortColumn = true;
        this.currentView = false;
        this.currentPackage = false;
        this.args = {};

        patchfox.listen("package:changed", (event, data) => {
            console.log(event, data);
        });

        const goPackage = ({ pkg, view, data }) => {
            try {
                let packageToOpen = patchfox.packages[pkg];
                let viewToOpen = view ? packageToOpen[view] : packageToOpen.view;
                let eventToSend = view ?
                    `package:activate:${pkg}:${view}` :
                    `package:activate:${pkg}:view`;

                this.currentView = false;
                this.args = {};

                // normal package
                if (packageToOpen && viewToOpen) {
                    this.args = data;
                    this.currentPackage = packageToOpen;
                    this.currentView = viewToOpen;
                    patchfox.emit("package:changed", { packageToOpen, view, data });
                    console.log("sending", eventToSend);
                    patchfox.emit(eventToSend, data);
                    return true;
                }
            } catch (e) {
                throw `Can't go to package ${pkg} and view ${view}`;
            }
        };

        const popState = ev => {
            if (ev.state !== null) {
                goPackage(ev.state);
            }
        };

        const handleUncaughtException = n => {
            goPackage({
                pkg: "errorHandler",
                data: {
                    currentPackage,
                    error: n
                }
            });
        };

        patchfox.listen("package:go", (event, { pkg, view, data }) => {
            if (typeof data === "undefined") {
                data = {};
            }
            let state = { pkg, view, ...data };
            let qs = queryString.stringify(state);
            history.pushState({ pkg, view, data }, "", `/index.html?${qs}`);
            goPackage({ pkg, view, data });
        });

        patchfox.listen("package:save:state", (event, { pkg, view, data }) => {
            if (typeof data === "undefined") {
                data = {};
            }

            let state = { pkg, view, ...data };
            let qs = queryString.stringify(state);
            history.pushState({ pkg, view, data }, "", `/index.html?${qs}`);
        });

        let qs = queryString.parse(location.search);
        let pkg = qs.pkg || getPref("default-package", "hub");
        let view = qs.view ? qs.view : "view";
        delete qs.pkg;
        delete qs.view;
        console.log("go from URL", { pkg, view, qs });
        patchfox.go(pkg, view, qs);
    }

    systemPackages() {
        const systemPackages = patchfox.systemPackages();

        return systemPackages.map(s => {
            return m(s.view)
        });
    }

    currentPackageOrApp() {
        if (this.currentPackage.app) {
            return m("div.container.wm-current-app-container", [
                m(this.currentView, this.args)
            ])
        } else if (this.currentView) {
            return m("div.container.wm-current-package-container", [
                m("div#wm-current-package.cyberpunk-container[augmented-ui=tr-clip-x br-clip-x exe]", [
                    m(this.currentView, this.args)
                ])
            ])
        }

        return m("div.container.wm-current-package-container", [
            m("div#wm-current-package.cyberpunk-container[augmented-ui=tr-clip-x br-clip-x exe]", [
                m("p", `no such package: ${this.currentPackage}`)
            ])
        ])
    }

    view() {
        return m("div.root.wm-backdrop", [
            this.systemPackages(),
            this.currentPackageOrApp()
        ])
    }
}

module.exports = WM;