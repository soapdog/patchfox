const { writable, derived } = require("svelte/store")
const { SSB } = require("./ssb")
const { savedKeys } = require("./prefs.js")

const queryString = require("query-string")
const Public = require("./views/Public.svelte")
const Default = require("./views/Default.svelte")
const Compose = require("./views/compose/Compose.svelte")
const ComposeBlog = require("./views/compose/blog/ComposeBlog.svelte")
const Thread = require("./views/Thread.svelte")
const Profile = require("./views/Profile.svelte")
const ErrorView = require("./views/ErrorView.svelte")
const Channels = require("./views/Channels.svelte")
const Channel = require("./views/Channel.svelte")
const Mentions = require("./views/Mentions.svelte")
const Settings = require("./views/Settings/Settings.svelte")
const Search = require("./views/Search.svelte");

const parseLocation = () => {
  let data = queryString.parse(window.location.search)
  let loc = window.location.hash.slice(1).replace("?", "")
  return { data, location: loc }
};

const intercept = () => {
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
      case "#":
        window.location = `/index.html?channel=${hash.replace("#","")}#/channel` 
        break
    }
  }
}

const connected = writable(false);

// maybe in the future, migrate routing system to:
// https://github.com/ItalyPaleAle/svelte-spa-router
const route = writable(parseLocation());
const routeParams = derived(route, $route => $route.data)
const routeLocation = derived(route, $route => $route.location)

const navigate = (location, data) => {
  data = data || {}
  route.set({ location, data });
  let dataAsQuery = queryString.stringify(data);
  let url = `/index.html?${dataAsQuery}#${location}`;
  console.log("navigate url", url)
  history.pushState({ location, data }, `Patchfox - ${location}`, `/index.html?${dataAsQuery}#${location}`);
  console.log(`Navigate ${location}`, data);
};


const routes = {
  "/thread": Thread,
  "/public": Public,
  "/compose/post": Compose,
  "/compose/blog": ComposeBlog,
  "/compose": Compose,
  "/profile": Profile,
  "/error": ErrorView,
  "/channels": Channels,
  "/channel": Channel,
  "/settings": Settings,
  "/mentions": Mentions,
  "/search": Search,
  "*": Default
};



const currentView = derived([connected, route], ([$connected, $route]) => {
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

const connect = async () => {
  console.log("Connecting to sbot...")
  window.ssb = new SSB();

  try {
    await ssb.connect(savedKeys())
    connected.set(true);
  } catch (err) {
    console.error("can't connect", err);
    connected.set(false)
    throw "Can't connect to sbot"
  }
}

const reconnect = () => {
  return new Promise((resolve, reject) => {
    const tryConnect = (data) => {
      window.ssb = new SSB();

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

const loadCaches = async () => {
  await ssb.loadCaches();
}

const keepPinging = () => {
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

module.exports = {
  connected,
  parseLocation,
  routeParams,
  intercept,
  connect,
  route,
  routeParams,
  routeLocation,
  navigate,
  currentView,
  reconnect,
  keepPinging,
  loadCaches
}