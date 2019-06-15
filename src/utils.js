import { writable, derived } from "svelte/store";
import { DriverHermiebox } from "./driver-hermiebox.js";

import queryString from "query-string";
import Public from "./views/Public.svelte";
import Default from "./views/Default.svelte";
import Compose from "./views/Compose.svelte";
import Thread from "./views/Thread.svelte";
import Profile from "./views/Profile.svelte";
import ErrorView from "./views/ErrorView.svelte";


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
  data = data || {}
  route.set({ location, data });
  let dataAsQuery = queryString.stringify(data);
  history.pushState({ location, data }, `Patchfox - ${location}`, `/index.html?${dataAsQuery}#${location}`);
};


const routes = {
  "/thread": Thread,
  "/public": Public,
  "/compose": Compose,
  "/profile": Profile,
  "/error": ErrorView,
  "*": Default
};


export const currentView = derived([connected, route], ([$connected, $route]) => {
  let r = $route.location
  if ($connected) {
    if (routes.hasOwnProperty(r)) {
      return routes[r];
    } else {
      console.log("didn't find", r);
      return routes["*"];
    }
  } else {
    return routes["*"]
  }
});


/// connection stuff

const configurationIsOK = savedData => {
  return (
    savedData.hasOwnProperty("keys") ||
    savedData.hasOwnProperty("keys") ||
    savedData.hasOwnProperty("keys")
  );
};

const connectAndLaunch = savedData => {
  window.ssb = new DriverHermiebox();

  ssb
    .connect(savedData.keys)
    .then(data => {
      console.log("connected");
      connected.set(true);
    })
    .catch(err => {
      console.error("can't connect", err);
      cantConnect();
    });
};

const configurationPresent = savedData => {
  if (!configurationIsOK(savedData)) {
    configurationMissing();
  } else {
    connectAndLaunch(savedData);
  }
};

const configurationMissing = () => {
  console.log("config missing");
  window.location = "/docs/index.html#/troubleshooting/no-configuration";
};

const cantConnect = () => {
  console.log("config missing");
  window.location = "/docs/index.html#/troubleshooting/no-connection";
};

export const connect = () => {
  browser.storage.local
    .get()
    .then(configurationPresent, configurationMissing);
}

export const reconnect = () => {
  return new Promise((resolve, reject) => {
    const tryConnect = (savedData) => {
      window.ssb = new DriverHermiebox();

      ssb
        .connect(savedData.keys)
        .then(data => {
          console.log("connected");
          connected.set(true);
          resolve()
        })
        .catch(err => {
          console.error("can't reconnect", err);
          reject(err);
        });
    }

    browser.storage.local
      .get()
      .then(tryConnect, reject);
  })
}
