/**
 * COMPONENT "SSB SCHEMA HANDLER"
 *
 * OBJECTIVE:
 * Is called when an `ssb:` URL is used. It finds out what needs to be done and switches route
 *
 * This is a Mithril component.
 */

import {getDriver} from "../drivers/driver.js"

export class SsbSchemaHandler {
    oninit(vnode) {
        let id = vnode.attrs.hash.replace("ssb:", "")
        let driver = getDriver()
        let {isBlobId, isFeedId, isMsgId} = driver.ref() // this maps to hermiebox.modules.ssbRef
        switch (id[0]) {
            case "#":
                console.log("Opening channel", id)
                m.route.set("/channel/:channel", {channel: id.slice(1)})
                break
            case "%":
                if (!isMsgId(id)) {
                    vnode.state.error = `intercept url should been a msg but it is not: ${id}`
                } else {
                    console.log("Opening thread", id)
                    m.route.set("/thread/:msg...", {"msg...": id.slice(1)})
                }

                break
            case "@":
                if (!isFeedId(id)) {
                    vnode.state.error = `intercept url should been a feed but it is not: ${id}`
                } else {
                    console.log("Opening feed", id)
                    m.route.set("/feed/:feed...", {feed: id})
                }

                break
            case "&":
                if (!isBlobId(id)) {
                    vnode.state.error = `intercept url should been a blob but it is not: ${id}`
                } else {
                    window.location = "http://localhost:8989/blobs/get/" + id
                }
                break
        }

        if (id.indexOf("javascript:") === 0) {
            vnode.state.error = "stop trying to inject JS here"
        }

        vnode.state.error = `can't find what to do with ${id}`
    }


    view(vnode) {
        return m("div", [
            vnode.state.error ? m("h1", `error: ${vnode.state.error}`) : m("h1", "Loading...")
        ])
    }
}
