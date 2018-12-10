import ssbKeys from 'ssb-keys'


var Model = {
  load: function () {
    Model.config = JSON.parse(localStorage.getItem("config")) || {
      remote: "",
      keys: "",
      manifest: require("../../../static/sbot-manifest.json")
    }
    console.log("Setup loading with", Model.config)
  },
  save: function () {
    console.log("trying to save configuration", Model.config)
    const remote = Model.config.remote
    const keys = Model.config.keys
    const manifest = Model.config.manifest
    localStorage.setItem("config", JSON.stringify({
      remote,
      keys,
      manifest
    }))
    console.log("saved!")
  }
}

export default Model