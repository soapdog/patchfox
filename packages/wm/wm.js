import m from "../../web_modules/mithril.js"
import css from "../../web_modules/csz.js"

let style = css`
background: var(--bg);
height: 100vh;
width: 100vw;
` 

export default class WM {
    static configuration() {
        return {
            system: true
        }
    }

    view() {
        return m("div.wm", {class: style})
    }
}