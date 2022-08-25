const m = require("mithril")
const AvatarChip = require("../../core/components/AvatarChip.js")
const Book = require("scuttle-book")
const b = Book(ssb.sbot)

const BookCard = {
  view: vnode => {
    let msg = vnode.attrs.msg

    let action = ""
    let msgid = msg.value.content.updates || msg.key
    let encodedid = encodeURIComponent(msgid)

    vnode.state.title = msgid

    if (msg.value.content.type === "bookclub") {
      action = "created book"
    } else if (msg.value.content.type == "bookclubUpdate") {
      action = "updated book"
    } else {
      action = "did some unspeakable act to book"
    }

    b.async.get(msgid, true, (err, book) => {
      if (err) {
        console.log(err)
        console.log("msg with problem:", msg)
        throw err
      }
      console.log(book)
      vnode.state.title = book.common.title
      m.redraw()
    })

    const goToBook = ev => {
      ev.stopPropagation()
      ev.preventDefault()
      if (typeof msgid === "undefined") {
        throw "Can't go to undefined message id"
        return false
      }
      if (ev.ctrlKey) {
        window.open(`?pkg=books&view=details&bookKey=${encodeURIComponent(msgid)}`)
      } else {
        patchfox.go("books", "details", { bookKey: msgid })
      }
    }

    return m("p.m-2", [
      m(AvatarChip, { inline: true, arrow: true, feed: msg.value.author }),
      action,
      m(
        "a",
        {
          href: `?pkg=books&view=details&bookKey=${encodedid}`,
          onclick: goToBook,
        },
        vnode.state.title
      ),
    ])
  },
}
module.exports = BookCard
