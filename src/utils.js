import { writable, derived } from "svelte/store";
import { SSB } from "./ssb.js";

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
import Mentions from "./views/Mentions.svelte"

let savedData = {}

export const parseLocation = () => {
  let data = queryString.parse(window.location.search)
  let loc = window.location.hash.slice(1).replace("?", "")
  return { data, location: loc }
};

export const intercept = () => {
  let r = parseLocation()
  if (r.location == "/intercept" && r.data.query) {
    let hash = r.data.query.replace("ssb:", "")
    let sigil = hash[0]
    switch (sigil) {
      case "%":
        window.location = `/index.html?thread=${encodeURIComponent(hash)}#/thread`
        break
      case "&":
        window.location = `http://localhost:8989/blobs/get/${hash}`
        break
      case "@":
        window.location = `/index.html?feed=${encodeURIComponent(hash)}#/profile`
        break
    }
  }
}

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
  console.log(`Navigate ${location}`, data);
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
  "/mentions": Mentions,
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

const configurationMissing = () => {
  console.log("config missing");
  window.location = "/docs/index.html#/troubleshooting/no-configuration";
};

const cantConnect = () => {
  console.log("config missing");
  window.location = "/docs/index.html#/troubleshooting/no-connection";
};

export const loadConfiguration = async () => {
  console.log("Loading configuration...")
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
  console.log("Connecting to sbot...")
  window.ssb = new SSB();

  try {
    await ssb.connect(savedData.keys)
    connected.set(true);
  } catch (err) {
    console.error("can't connect", err);
    connected.set(false)
    throw "Can't connect to sbot"
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

export const keepPinging = () => {
  let interval = setInterval(() => {
    if (hermiebox.sbot) {
      hermiebox.sbot.whoami((err, v) => {
        if (err) {
          console.error("can't call whoami", err);
          reconnect().catch(n => {
            console.error("can't reconnect");
            clearInterval(interval);
            navigate("/error", { error: n });
          });
        }
      });
    }
  }, 5000);
}

// Preferences

export const getPref = (key, defaultValue) => {
  if (savedData.hasOwnProperty("preferences")) {
    let preferences = savedData.preferences
    if (preferences.hasOwnProperty(key)) {
      return preferences[key]
    }
  }
  return defaultValue
}

export const setConnectionConfiguration = ({ keys, remote, manifest }) => {
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
