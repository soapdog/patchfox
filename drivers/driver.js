import {DriverHermiebox} from "./driver-hermiebox.js"

var driver = false

export function getDriver() {
    if (!driver) {
        driver = new DriverHermiebox()
    }

    return driver
}
