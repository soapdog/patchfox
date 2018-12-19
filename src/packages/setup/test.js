import m from "mithril";
import Model from "./model";
import client from "ssb-client";
import config from "ssb-config";
import avatar from "ssb-avatar";

const silentTest = (keys, remote, manifest) => {
  return new Promise((resolve, reject) => {
    client(keys, {
      remote: remote,
      caps: config.caps,
      manifest: manifest
    }, (err, s) => {

      if (err) {
        reject(`Connecting to sbot, <a href="#/setup">go back to setup</a> and check your settings. Also, make sure <i>sbot</i> is running (is scuttle-shell icon appearing on your machine?).`)
      } else {

        avatar(s, s.id, s.id, (err, data) => {
          if (data) {
            resolve(s);
          } else {
            reject(`can't query user: ${err}`);
          }
        })
      }
    })
  })
}

const testClient = (keys, remote, manifest) => {
  client(keys, {
    remote: remote,
    caps: config.caps,
    manifest: manifest
  }, (err, s) => {

    if (err) {
      console.dir(err);
      SetupTest.error(`Connecting to sbot, <a href="#/setup">go back to setup</a> and check your settings. Also, make sure <i>sbot</i> is running (is scuttle-shell icon appearing on your machine?).`);
      return false;
    }

    avatar(s, s.id, s.id, (err, data) => {

      if (data) {
        SetupTest.ok(`You are <b><a href="#/profile/${data.id}">${data.name}</a></b>`);
        window.sbot = s;
        SetupTest.status = true;
      } else {
        SetupTest.error(`can't query user: ${err}`);
      }
    });
  });
}

var SetupTest = {
  silentTest,
  reload: (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    location.reload();
  },
  ok: msg => {
    SetupTest.log.push({ status: "ok", msg });
    m.redraw();
  },
  error: msg => {
    SetupTest.log.push({ status: "error", msg });
    console.log(msg);
    m.redraw();
  },
  oninit: vnode => {
    SetupTest.log = [];
    SetupTest.status = false;
    SetupTest.ok("Loading Configuration");
    Model.load();
    SetupTest.ok("Configuration loaded");
    var configKeys = ["remote", "keys", "manifest"];
    configKeys.forEach(i => {
      if (Model.config.hasOwnProperty(i)) {
        SetupTest.ok(`Found configuration for ${i}`);
      } else {
        SetupTest.error(`can't find configuration for ${i}`);
      }
    })
    SetupTest.ok("Attempting connection to sbot...");
    m.redraw();
    testClient(Model.config.keys, Model.config.remote, Model.config.manifest);
  },
  view: (vnode) => {
    return m("div#setup-test", [
      m("h1", "Configuration Test"),
      m("p", "Will update automatically with info from your config"),
      m("ul", SetupTest.log.map(l => {
        if (l.status == "ok") {
          return m("li", m.trust(`OK: ${l.msg}`))
        } else {
          return m("li", m.trust(`Error: ${l.msg}`))
        }
      })),
      vnode.state.status == true ? m("p", m.trust(`Your configuration appears to be working well. Let's check the scuttleverse by going to your <a href="#/public">Public feed<a> :-)`))
        :
        m("div",
          [
            m.trust(`<h2>Troubleshooting tips</h2>
          <ul>
            <li>Double check the configuration at <a href="#/setup">Setup<a></li>
            <li>Make sure <i>sbot</i> is running.</li>
            <li>Do you want Patchfox to start <a href="http://github.com/ssbc/scuttle-shell">Scuttle Shell</a>?</li>
          </ul>
          `),
            m("a", {
              href: '/start-scuttle-shell',
              oncreate: m.route.link
            }, "Click to Start Scuttle Shell"),
            m("span", " or "),
            m("a", {
              href: '/setup-test',
              oncreate: m.route.link,
              onclick: SetupTest.reload
            }, "Click to try again")
          ])

    ]);

  }
}

export default SetupTest;