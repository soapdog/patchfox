const m = require("mithril")
const AvatarChip = require("./AvatarChip.js")
const _ = require("lodash")

function AvatarListing() {
  let queue = []
  let data = {}

  function nextAvatarLoad() {
    return new Promise((resolve, reject) => {
      let feed = queue.shift()

      ssb.avatar(feed).then(data => {
        let res = {}

        if (!data) {
          return
        }
        // console.log(`avatar for ${feed}`, data)
        if (data.image !== null && data.image !== undefined) {
          res.image = `${patchfox.blobUrl(data.image)}`
        }
        res.name = data.name

        data[feed] = res

        resolve(res)
      })
    })
  }

  return {
    oninit: vnode => {
      queue = vnode.attrs.feeds
    },
    view: vnode => {
      return m(
        "div",
        { style: { columns: "3 200px" } },
        vnode.attrs.feeds.map(f =>
          m(AvatarChip, {
            feed: f,
            avatarLoadingFunction: _.throttle(nextAvatarLoad, 500),
          })
        )
      )
    },
  }
}

module.exports = AvatarListing
