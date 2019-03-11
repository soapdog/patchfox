/**
 * COMPONENT "PUBLIC VIEW"
 * 
 * OBJECTIVE:
 * Provide a public view of your feed.
 * 
 * This is a Mithril.
 */

import {getDriver} from "../drivers/driver.js"

export class PublicView {
    constructor() {
        this.driver = getDriver()
    }

    view() {
        this.driver.public()
        return m("h1", "PATCHFOX")
    }
}
