import m from "../../web_modules/mithril.js"
import css from "../../web_modules/csz.js"


let styleTop = css`
background: var(--bg);
opacity: var(--opacity, 0.8);
height: var(--height, 30px);
position: absolute;
top: 0px;
left: 0px;
width: 100vw;
z-index: 9999;

    ol {
        list-style-type: none;
        padding-left: 0;
        margin: 0;
        opacity: 1

        li {
            display: inline-block;
            cursor: pointer;
        }
    }
}
`

export default class Dock {
    static configuration() {
        return {
            system: true
        }
    }

    constructor() {
        this.i = 0

        console.log("constructor")
        let data = fs.readdirSync("/")
        console.log("dir", data)
    }

    changeOpacity(vnode) {
        vnode.dom.style.setProperty("--opacity", 0.3)
        vnode.dom.style.setProperty("--bg", "var(--base04)")


        this.i+=1;
    
        console.log("click", vnode)
    }

    view(vnode) {

        return m("nav.dock", { class: styleTop, style: this.configurableStyle }, [
            m("ol", [
                m("li.emoji", { onclick: () => this.changeOpacity(vnode) }, "😀 " + this.i),
                m("li.emoji", "😁"),
                m("li.emoji", "😎")
            ])
        ])
    }
}
