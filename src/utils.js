import { writable, derived } from "svelte/store";
import queryString from "query-string";
import Public from "./views/Public.svelte";
import Default from "./views/Default.svelte";
import Compose from "./views/Compose.svelte";
import Thread from "./views/Thread.svelte";
import Profile from "./views/Profile.svelte";


export const parseLocation = () => {
    let data = queryString.parse(window.location.search)
    let loc = window.location.hash.slice(1).replace("?", "")
    return { data, location: loc }
};

export const connected = writable(false);

export const route = writable(parseLocation());
export const routeParams = derived(route, $route => $route.data)
export const routeLocation = derived(route, $route => $route.location)

export const navigate = (location, data) => {
    console.log("Navigating to", location)
    console.dir("Data:", data)
    route.set({ location, data });
    let dataAsQuery = queryString.stringify(data);
    history.pushState({location, data}, `Patchfox - ${location}`, `/index.html?${dataAsQuery}#${location}`);
};


const routes = {
    "/thread": Thread,
    "/public": Public,
    "/compose": Compose,
    "/profile": Profile,
    "*": Default
};


export const currentView = derived([connected, route], ([$connected, $route]) => {
    let r = $route.location
    if ($connected) {
        console.log("currentView, searching for", r)
        if (routes.hasOwnProperty(r)) {
            console.log("found!", r);
            return routes[r];
        } else {
            console.log("didn't find", r);
            return routes["*"];
        }
    } else {
        return routes["*"]
    }
});


