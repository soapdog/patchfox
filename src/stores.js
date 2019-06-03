import { writable, derived } from "svelte/store";

export const connected = writable(false);

export const route = writable({ location: window.location.hash.slice(1), data: {} });

export const navigate = (location, data) => {
    console.log("Navigating to", location)
    route.set({ location, data });
    history.pushState(data, `Patchfox - ${location}`, `/index.html#${location}`);
};
