const { join } = require("path")
const ahoy = require("./ssb-ahoy-ish/index.js")
const path = require("path")

const homedir = require("os").homedir()

ahoy(
  `file://${join(__dirname, "../dist", "index.html")}`,
  {
    title: "Patchfox Desktop",
    plugins: [
      require("ssb-db"),
      require("ssb-backlinks")
    ],
    config: {
      path: path.join(homedir, ".ssb")
    }
  },
  (err, ssb) => {
    if (err) throw err

    console.log("ahoy started", ssb.id)    
  }
)
