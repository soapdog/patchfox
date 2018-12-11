import Setup from "./view"
import SetupTest from "./test"
import Model from "./model"

var pkg = {
  name: "Setup",
  description: "A Core Package responsible for SSB setup.",
  routes: [
    { route: "/setup", view: Setup },
    { route: "/setup-test", view: SetupTest }
  ],
  oninit: async () => {
    console.log("Setup is attempting connection to sbot")
    Model.load()
    try {
      var sbot = await SetupTest.silentTest(Model.config.keys, Model.config.remote, Model.config.manifest)
      console.log("Sbot works, you are", sbot.id)
      window.sbot = sbot
    } catch (n) {
      console.log("error in silent test", n)
      window.sbot = false
    }
  }
}

export default pkg;