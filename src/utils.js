import { writable, derived } from "svelte/store";
import { DriverHermiebox } from "./driver-hermiebox.js";

import queryString from "query-string";
import Public from "./views/Public.svelte";
import Default from "./views/Default.svelte";
import Compose from "./views/Compose.svelte";
import Thread from "./views/Thread.svelte";
import Profile from "./views/Profile.svelte";
import ErrorView from "./views/ErrorView.svelte";
import Channels from "./views/Channels.svelte"
import Channel from "./views/Channel.svelte"
import Settings from "./views/Settings.svelte"

let savedData = {}

export const parseLocation = () => {
  let data = queryString.parse(window.location.search)
  let loc = window.location.hash.slice(1).replace("?", "")
  return { data, location: loc }
};

export const connected = writable(false);

// maybe in the future, migrate routing system to:
// https://github.com/ItalyPaleAle/svelte-spa-router
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
  "/channels": Channels,
  "/channel": Channel,
  "/settings": Settings,
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
    if (r === "/settings") {
      return Settings
    } else {
      return routes["*"];
    }
  }


});


/// connection stuff

const configurationIsOK = savedData => {
  return (
    savedData.hasOwnProperty("keys")
  );
};

const connectAndLaunch = data => {
  window.ssb = new DriverHermiebox();

  ssb
    .connect(data.keys)
    .then(data => {
      console.log("connected");
      connected.set(true);
    })
    .catch(err => {
      console.error("can't connect", err);
      cantConnect();
    });
};

const configurationPresent = data => {
  savedData = data || {}
  if (!configurationIsOK(data)) {
    configurationMissing();
  } else {
    connectAndLaunch(data);
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

export const loadConfiguration = async () => {
  try {
    let data = await browser.storage.local.get()

    if (data.hasOwnProperty("keys")) {
      savedData = data
    } else {
      throw "Configuration is missing"
    }
  } catch (n) {
    throw "Configuration is missing"
  }
}

export const connect = async () => {
  window.ssb = new DriverHermiebox();

  try {
    await ssb.connect(savedData.keys)
    connected.set(true);
  } catch (err) {
    console.error("can't connect", err);
    cantConnect();
  }
}

export const reconnect = () => {
  return new Promise((resolve, reject) => {
    const tryConnect = (data) => {
      window.ssb = new DriverHermiebox();

      ssb
        .connect(data.keys)
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

// Preferences

export const getPref = (key, defaultValue) => {
  if (savedData.hasOwnProperty("preferences")) {
    let preferences = savedData.preferences
    if (preferences.hasOwnProperty(key)) {
      console.log(`getPref - ${key}`, preferences[key])
      return preferences[key]
    }
  }
  return defaultValue
}

export const setConnectionConfiguration = ({keys, remote, manifest}) => {
  savedData.keys = keys
  savedData.remote = remote 
  savedData.manifest = manifest

  browser.storage.local.set(savedData)

}

export const setPref = (key, value) => {
  console.log(`setPref - ${key}`, value)
  savedData.preferences = savedData.preferences || {}
  savedData.preferences[key] = value

  browser.storage.local.set(savedData)
}
