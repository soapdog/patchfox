/**
 * Hermiebox Driver
 * 
 * TL;DR: SSB API for Patchfox using Hermiebox.
 * 
 * OBJECTIVE:
 * The SSB is in flux right now. There are many approaches being played with which might 
 * affect how this WebExtension connect to sbot. Some of the experiments being tried out are:
 * 
 * - lessbot/nobot: each app maintain its own database and index but post through a shared sbot.
 * - graphql: export a GraphQL server which offers SSB features.
 * - json-rpc: export a JSON-RPC server offering SSB features.
 * 
 * This driver folder will contain the various adapters to use these modes of connection as they
 * become available. For now, we'll use hermiebox.
 * 
 * **Important: Each driver should export the exact same API to Patchfox**. This way we can 
 * switch drivers without having to refactor the add-on.
 * 
 * HOW IT WORKS:
 * Hermiebox is a browserified fat package of common NodeJS modules from our community and also
 * few highlevel API methods for common tasks. It uses WebSockets to connect to a running sbot
 * using muxrpc and shs stuff, so it needs your `secret` to be available.
 */

export class DriverHermiebox {
    constructor() {
        this.name = "Driver for Hermiebox"
    }

    log(pMsg, pVal = "") {
        console.log(`[Driver Hermiebox] - ${pMsg}`, pVal)
    }

    async connect(pKeys) {
        var server = await hermiebox.api.connect(pKeys)
        this.log("you are", server.id)
    }

    async public(opts) {
        var msgs = await hermiebox.api.pullPublic(opts)
        return msgs
    }

    async setAvatarCache(feed, data) {
        let s = {}
        s[`avatar-${feed}`] = data
        return browser.storage.local.set(s)
    }

    async getCachedAvatar(feed) {
        return browser.storage.local.get(`avatar-${feed}`)
    }

    async avatar(feed) {
        try {
            let avatar = await hermiebox.api.avatar(feed)
            await this.setAvatarCache(feed, avatar)
            return avatar
        } catch(n) {
            throw n
        }

    }
}

 
