const m = require("mithril")
const pull = require("pull-stream")
const Book = require("scuttle-book")
const b = Book(ssb.sbot)
const { timestamp } = require("../../core/components/timestamp.js")
const { when } = require("../../core/components/utils.js")
const AvatarRound = require("../../core/components/AvatarRound.js")
const AvatarContainer = require("../../core/components/AvatarContainer.js")

const fetchBook = (vnode) => {
  b.async.get(vnode.state.bookKey, true, (err, data) => {
    console.log(data)
    vnode.state.book = data
    let book = data

    if (book.reviews[ssb.feed].rating !== "" || book.reviews[ssb.feed].review) {
      vnode.state.newRating = book.reviews[ssb.feed].rating || ""
      vnode.state.newRatingType = book.reviews[ssb.feed].ratingType || ":star:"
      vnode.state.newRatingMax = book.reviews[ssb.feed].ratingMax || "5"
      vnode.state.newReviewText = book.reviews[ssb.feed].review || ""
      vnode.state.newShelves = book.reviews[ssb.feed].shelves.join(", ") || ""
    }
    patchfox.title(book.common.title)
    m.redraw()
  })
}

const BookDetails = {
  oninit: vnode => {
    vnode.state.bookKey = false

    vnode.state.book = false
    vnode.state.currentSubView = "readers-and-reviews"

    vnode.state.newRating = ""
    vnode.state.newRatingType = ":star:"
    vnode.state.newRatingMax = "5"
    vnode.state.newReviewText = ""
    vnode.state.newShelves = ""
    vnode.state.saving = false

    fetchBook(vnode)
  },
  view: vnode => {
    let book = vnode.state.book
    let currentSubView = vnode.state.currentSubView

    const avatarClick = ev => {
      let feed = ev.detail.feed

      patchfox.go("contacts", "profile", { feed })
    }

    let newRating = vnode.state.newRating
    let newRatingType = vnode.state.newRatingType
    let newRatingMax = vnode.state.newRatingMax
    let newReviewText = vnode.state.newReviewText
    let newShelves = vnode.state.newShelves

    const getFieldValue = (id) => document.getElementById(id).value

    const newReview = () => {
      vnode.state.saving = true

      let bookRating = {
        type: "bookclubUpdate",
        review: getFieldValue("field-review"),
        rating: getFieldValue("field-rating"),
        ratingMax: getFieldValue("field-rating-max"),
        ratingType: getFieldValue("field-rating-type"),
        shelves: getFieldValue("field-shelves").split(",").map(i => i.trim()),
      }

      b.async.update(vnode.state.bookKey, bookRating, (err, updateMsg) => {
        if (!err) {
          vnode.state.saving = false
          fetchBook(vnode)
          vnode.state.currentSubView = "readers-and-reviews"
        }
      })
    }

    const loading = m(".loading.loading-lg")

    const bookCover = m(
      ".flex-initial",
      m(".container.m-4", [
        when(
          book.common.image,
          m("img.img-responsive", {
            src: patchfox.httpUrl("/blobs/get/" + book.common.image.link),
            alt: book.common.image.name,
          })
        ),
        when(
          Array.isArray(book.common.images),
          m("img.img-responsive", {
            src: patchfox.httpUrl("/blobs/get/" + book.common.images[0].link),
            alt: book.common.images[0].name,
          })
        ),
        when(
          book.common.images.hasOwnProperty("link"),
          m("img.img-responsive", {
            src: patchfox.httpUrl("/blobs/get/" + book.common.images.link),
            alt: book.common.images.name,
          })
        ),
      ])
    )

    const bookTitleAndDescription = m(".flex-1", m(".prose", [m("h1", book.common.title), m("h3.card-subtitle.text-gray", book.common.authors), when(book.common.series && book.common.seriesNo, m("h3.card-subtitle.text-gray", `Book #${book.common.seriesNo.replace("#", "")} in the ${book.common.series} series.`)), when(book.common.series && !book.common.seriesNo, m("h2.card-subtitle.text-gray", `Part of the ${book.common.series} series.`)), m.trust(ssb.markdown(book.common.description))]))

    const editButton = m(
      "a.btn.btn-sm",
      {
        href: patchfox.url("books", "edit", { bookKey: book.key }),
      },
      "Edit Book"
    )

    const bookMetadata = m(".flex", [bookCover, bookTitleAndDescription, editButton])

    const tabs = [tabControls, ...tabContents]

    const makeTabButton = (view, label) => {
      return m(
        "li.tab",
        {
          class: when(currentSubView == view, "tab-active"),
        },
        m(
          "a",
          {
            onclick: () => {
              vnode.state.currentSubView = view
            },
          },
          label
        )
      )
    }

    const tabControls = m("tabs.tabs-boxed.mb-4", [makeTabButton("readers-and-reviews", "Readers & Reviews"), makeTabButton("new-review", "Submit Review")])

    const tabContents = [when(currentSubView == "readers-and-reviews", readersAndReviews), when(currentSubView == "new-review", reviewForm)]

    const makeReviewView = ([reader, review]) => {
      if (review.key == "") {
        return false
      }

      if (Array.isArray(review.shelves)) {
        review.shelves = review.shelves.join(", ")
      }

      if (review.ratingType !== "/") {
        let temp = review.ratingType
        review.ratingType = review.ratingMax
        review.ratingMax = temp
      }

      return m(".review", [m(".mr-2", m(AvatarRound, { feed: reader })), m(".speech-bubble", m(".container", [m("b", `Rating: ${review.rating}${review.ratingType}${review.ratingMax}`), m(".prose", m.trust(ssb.markdown(review.review))), when(review.shelves && review.shelves !== "", m("p", m.trust(`<b>Shelved in: </b> ${review.shelves}.`)))]))])
    }

    const readersAndReviews = m("div", [
      m("h3.uppercase.font-medium", "Readers"),
      m(
        AvatarContainer,
        book.readers.map(reader => m(AvatarRound, { feed: reader }))
      ),
      m("br"),
      m("h3.uppercase.font-medium", "Reviews"),
      Array.from(Object.entries(book.reviews)).map(([reader, review]) => makeReviewView(reader, review)),
    ])

    const makeField = (label, id, placeholder = "") =>
      m(".form-control", [
        m("label.label", { for: id }, label),
        m("input.input.input-bordered", {
          type: "text",
          placeholder,
          id,
        }),
      ])

    const reviewForm = m("div", [
      m("h3.uppercase.font-medium", "New Review"),
      m("form", { onsubmit: newReview }, [
        makeField("Rating", "field-rating"),
        makeField("Rating Type", "field-rating-type"),
        makeField("Rating Maximum Value", "field-rating-max"),
        m(".form-control", [
          m("label.label", { for: "field-review" }, m("span.label-text", "Review")),
          m("textarea.textarea.textarea-bordered", {
            id: "field-review",
            placeholder: "your review...",
          }),
        ]),
        makeField("Shelves", "field-shelves", "comma separated shelves..."),
        m("input.btn.btn-primary.mt-2", {
          class: vnode.state.saving ? "loading" : "",
          type: "submit",
          disabled: vnode.state.saving,
          value: "Submit Review",
        }),
      ]),
    ])

    return m(".container.mx-auto.lg:px-4", [
      m(
        "a.btn.btn-sm.btn-ghost.mb-2",
        {
          href: patchfox.url("books"),
        },
        "Go Back To Book List"
      ),
      !vnode.state.book ? loading : [bookMetadata, ...tabs],
    ])
  },
}

module.exports = BookDetails
