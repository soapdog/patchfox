const m = require("mithril")
const Stream = require("mithril/stream")
const manifest = require("../../core/platforms/ssb/manifest.js")

const {
    getPref,
    setPref,
} = patchfox;

class ContentWarnings {

    view(vnode) {
        return [
            m("h1.title", "Content Warnings"),
            m("form.form-group", [
                m("label.form-label", `
                Should Content Warnings by collapsed or expanded by default?
                `),
                m("label.form-radio", [
                    m("input[type=radio]", {
                        name: "content-warnings",
                        value: "collapsed",
                        checked: getPref("content-warnings-expand", "collapsed") === "collapsed",
                        onchange: () => setPref("content-warnings-expand", "collapsed")
                    }),
                    m("i.form-icon"),
                    "Collapsed"
                ]),
                m("label.form-radio", [
                    m("input[type=radio]", {
                        name: "content-warnings",
                        value: "long",
                        checked: getPref("content-warnings-expand", "collapsed") === "expanded",
                        onchange: () => setPref("content-warnings-expand", "expanded")
                    }),
                    m("i.form-icon"),
                    "Expanded"
                ])

            ])
        ]
    }
}

module.exports = ContentWarnings