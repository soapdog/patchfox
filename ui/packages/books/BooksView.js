const m = require("mithril")
const pull = require("pull-stream")
const { timestamp } = require("../../core/components/timestamp.js")
const { when } = require("../../core/utils.js")
const Book = require("scuttle-book")
const book = Book(ssb.sbot)

const fetchBooks = vnode => {
  vnode.state.books = []
  pull(
    book.pull.books({ reverse: vnode.state.shouldReverse }, true, false),
    pull.drain(data => {
      vnode.state.books.push(data)
      m.redraw()
    })
  )
}

const BooksView = {
  oninit: vnode => {
    vnode.state.books = []
    vnode.state.shouldReverse = true

    fetchBooks(vnode)
  },
  view: vnode => {
    const sortByOldest = () => {
      vnode.state.shouldReverse = false
      fetchBooks(vnode)
    }

    const sortByNewest = () => {
      vnode.state.shouldReverse = true
      fetchBooks(vnode)
    }

    const makeBook = book => {
      const bookImage = m("figure.flex-shrink", [
        when(
          book.common.image,
          m("img", {
            src: patchfox.httpUrl("/blobs/get/" + book.common.image.link),
            alt: book.common.image.name,
          })
        ),
        when(
          Array.isArray(book.common.images) && book.common?.images[0].hasOwnProperty("link"),
          m("img", {
            src: patchfox.httpUrl("/blobs/get/" + book.common.images[0].link),
            alt: book.common.images[0].name,
          })
        ),
        when(
          book.common.images?.hasOwnProperty("link"),
          m("img", {
            src: patchfox.httpUrl("/blobs/get/" + book.common.images.link),
            alt: book.common.images.name,
          })
        ),
      ])

      if (typeof book.common.seriesNo == "string") {
        book.common.seriesNo = book.common.seriesNo.replace("#", "")
      }

      const bookBody = m(".card-body", [
        m(".card-title.uppercase.font-medium", book.common.title),
        m(".card-subtitle.text-gray", book.common.authors),
        when(book.common.series && book.common.seriesNo, m(".card-subtitle.text-gray", `Book #${book.common.seriesNo} in the ${book.common.series} series.`)),
        when(book.common.series && !book.common.hasOwnProperty("seriesNo"), m(".card-subtitle.text-gray", `Part of the ${book.common.series} series.`)),
        m(".prose", m.trust(ssb.markdown(book.common.description.slice(0, 200).replace(/h1/gi, "h3") + "..."))),
        m("div", [when(book?.readers, m("span.text-gray", m.trust(`${book.readers.length} <i class="fas fa-user"></i>`))), when(book?.reviews, m("span.text-gray", m.trust(`${Object.keys(book.reviews).length} <i class="fas fa-file-alt"></i>`))), m("span.ml-2", timestamp(book.msg.timestamp))]),
      ])

      const bookActions = m(
        ".card-actions",
        m(
          "a.btn.btn-primary",
          {
            href: patchfox.url("books", "details", { bookKey: book.msg.key }),
          },
          "Read more"
        )
      )

      return m(
        ".item",
        m(".card.shadow-sm.bg-accent.text-accent-content", [
          // image
          bookImage,
          // body
          bookBody,
          // actions
          bookActions,
        ])
      )
    }

    return m(".container", [
      m(".flex.mb-4", [
        m(
          "a.btn",
          {
            href: patchfox.url("books", "edit"),
          },
          "Add New Book"
        ),
        m("span.flex-1.p-2.text-center", `${vnode.state.books.length} books found on SSB`),
        m(".btn-group", [
          m(
            "button.btn.btn-outline",
            {
              class: !vnode.state.shouldReverse ? "btn-active" : "",
              onclick: sortByOldest,
            },
            "Sort by oldest additions"
          ),
          m(
            "button.btn.btn-outline",
            {
              class: vnode.state.shouldReverse ? "btn-active" : "",
              onclick: sortByNewest,
            },
            "Sort by newest additions"
          ),
        ]),
      ]),
      when(vnode.state.books.length == 0, m(".loading")),
      when(
        vnode.state.books.length > 0,
        m(
          ".grid.grid-cols-4.gap-4",
          vnode.state.books.map(book => makeBook(book))
        )
      ),
    ])
  },
}

module.exports = BooksView
