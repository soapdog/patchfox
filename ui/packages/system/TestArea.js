const m = require("mithril")
const Crut = require("ssb-crut")
const Overwrite = require("@tangle/overwrite")
const SimpleSet = require("@tangle/simple-set")

const sbot = ssb.sbot

const TestArea = {
  oninit: (vnode) => {
    const spec = {
      type: "bookDistribution",
      props: {
        title: Overwrite(),
        links: SimpleSet()
      }
    }

    const crut = new Crut(ssb, spec) // ssb = an ssb server

    crut.create(
      {
        title: "Four Decentralization Protocols",

        links: { add: ["https://leanpub.com/four-decentralisation-protocols"] },

      },
      (err, msgId) => {
        //
        console.log(err)
        console.log(msgId)
        sbot.get(msgId, (err2, data) => {
          console.log(err2)
          console.log(data)
        })
      }
    )
  },
  view: (vnode) => {
    return m("p", "check logs")

  },
}

module.exports = TestArea
