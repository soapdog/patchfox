import m from "../../web_modules/mithril.js"

export default class Test {
    static configuration() {
        return {system: true}
    }

    constructor(vnode) {
        this.count = 0
    }
    increment() {
        this.count += 1
    }
    decrement() {
        this.count -= 1
    }
    view() {
        return m("div",
            m("p", "Count: " + this.count),
            m("button", {
                onclick: () => {this.increment()}
            }, "Increment"),
            m("button", {
                onclick: () => {this.decrement()}
            }, "Decrement")
        )
    }
}