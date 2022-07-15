const m = require("mithril")
  const pull = require("pull-stream")
  const Book = require("scuttle-book")
  const b = Book(ssb.sbot)
  const { timestamp } = require("../../core/components/timestamp.js")
const { when } = require("../../core/components/utils.js")
  const AvatarRound = require("../../core/components/AvatarRound.js")
  const AvatarContainer = require("../../core/components/AvatarContainer.js")


const fetchBook = () => {
    b.async.get(vnode.state.bookKey, true, (err, data) => {
      console.log(data)
      vnode.state.book = data

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

  const newReview = () => {
    vnode.state.saving = true

    let bookRating = { 
      type: "bookclubUpdate", 
      review: newReviewText, 
      rating: newRating, 
      ratingMax: newRatingMax, 
      ratingType: newRatingType,
      shelves: newShelves.split(",").map((i) => i.trim())  
    }

    b.async.update(vnode.state.bookKey, bookRating, (err, updateMsg) => {
      if (!err) {
        vnode.state.saving = false
        fetchBook(vnode)
        vnode.state.currentSubView = "readers-and-reviews"
      }
    })
  }


  <div class="container mx-auto lg:px-4">
    <a class="btn btn-sm btn-ghost mb-2" href="{patchfox.url("books")}">Go Back To Book List</a>
    {#if book == false}
    <div class="loading loading-lg" />
    {:else}
    <div class="flex">

      <div class="flex-initial">
        <div class="container m-4">
          {#if book.common.image}
            <img class="img-responsive" src="{patchfox.httpUrl("/blobs/get/" + book.common.image.link)}" alt="{book.common.image.name}">
          {:else if Array.isArray(book.common.images)}
            <img class="img-responsive" src="{patchfox.httpUrl("/blobs/get/" + book.common.images[0].link)}" alt="{book.common.images[0].name}">
          {:else if book.common.images.hasOwnProperty("link")}
            <img class="img-responsive" src="{patchfox.httpUrl("/blobs/get/" + book.common.images.link)}" alt="{book.common.images.name}">
          {/if}
        </div>

      </div>
      <div class="flex-1">
        <div class="prose">
          <h1>
            {book.common.title}
          </h1>
          <h3 class="card-subtitle text-gray">
            {book.common.authors}
          </h3>
          {#if book.common.series && book.common.seriesNo}
          <h3 class="card-subtitle text-gray">
            Book #{book.common.seriesNo.replace("#","")} in the {book.common.series} series.
          </h3>
          {:else if book.common.series }
          <h3 class="card-subtitle text-gray">
            Part of {book.common.series} series.
          </h3>
          {/if}

          {@html ssb.markdown(book.common.description)}
        </div>
        
        <a class="btn btn-sm" href="{patchfox.url("books", "edit", {bookKey: book.key})}">Edit Book</a>

      </div>
    </div>
    <br/>
    <div class="tabs tabs-boxed mb-4">
      <li class="tab" class:tab-active={currentSubView === "readers-and-reviews"}>
        <a href="#" on:click|preventDefault={() => (currentSubView = "readers-and-reviews")}>
          Readers & Reviews
        </a>
      </li>
      <li class="tab" class:tab-active={currentSubView === "new-review"}>
        <a href="#" on:click|preventDefault={() => (currentSubView = "new-review")}>
          Submit Review
        </a>
      </li>
    </div>
    {#if currentSubView === "readers-and-reviews"}
    <div>
    {#if book.readers}
      <h3 class="uppercase font-medium">Readers</h3>
      <AvatarContainer>
      {#each book.readers as reader}
        <AvatarRound feed={reader} on:avatarClick={avatarClick} />
      {/each}
      </AvatarContainer>
    {/if}
    <br/>
    <h3 class="uppercase font-medium">Reviews</h3>
      {#each Array.from(Object.entries(book.reviews)) as [reader, review]}
          {#if review.key !== ""}
          <div class="review">
            <div class="mr-2">
              <AvatarRound feed={reader} on:avatarClick={avatarClick} />
            </div>
          <div class="speech-bubble">
            <div class="container">
              {#if review.rating !== ""}
                {#if review.ratingType === "/"}
                <b>Rating: {review.rating}{review.ratingType}{review.ratingMax}</b>
                {:else if review.ratingMax === "/"}
                <b>Rating: {review.rating}{review.ratingMax}{review.ratingType}</b>
                {:else}
                <b>Rating: {review.rating} {@html ssb.markdown(review.ratingType).replace("<p>","").replace("</p>","")} {#if review.ratingMax}of {review.ratingMax}{/if}</b>
                {/if}
              {/if}
              {#if review.review.length > 0}
              <div class="prose">
                {@html ssb.markdown(review.review)}
              </div>
              {/if}
              {#if review.shelves && review.shelves !== ""}
              <p><b>Shelved in: </b> {#if Array.isArray(review.shelves)}{review.shelves.join(", ")}{:else}{review.shelves}{/if}</p>
              {/if}
            </div>
          </div>
        </div>
        {/if}
      {/each}
    </div>
    {:else if currentSubView === "new-review"}
        <div>
          <h2 class="uppercase font-medium">Submit Review</h2>
          <form on:submit|preventDefault={newReview}>

            <div class="form-control">
              <label class="label" for="field-rating">
                <span class="label-text">Rating</span>
              </label>
              <input
                class="input input-bordered"
                type="text"
                id="field-rating"
                bind:value={newRating}
                placeholder="Rating" />
            </div>

            <div class="form-control">
              <label class="label" for="field-rating-type"><span class="label-text">Type</span></label>
              <input
                class="input input-bordered"
                type="text"
                id="field-rating-type"
                bind:value={newRatingType}
                placeholder="Rating Type" />
            </div>

            <div class="form-control">
              <label class="label" for="field-rating-max">
                <span class="label-text">Rating Maximum Value</span>
              </label>
              <input
                class="input input-bordered"
                type="text"
                id="field-rating-max"
                bind:value={newRatingMax}
                placeholder="" />
            </div>

            <div class="form-control">
              <label class="label" for="field-review">
                <span class="label-text">Review</span>
              </label>
              <textarea bind:value={newReviewText} class="textarea textarea-bordered" id="field-review" placeholder="Your review"></textarea>
            </div>

            <div class="form-control">
              <label class="label" for="field-shelves">
                <span class="label-text">Shelves</span>
              </label>
              <input
                class="input input-bordered"
                type="text"
                id="field-shelves"
                bind:value={newShelves}
                placeholder="comma separated shelves" />
            </div>
            
            <input
              id="save-field-button"
              type="submit"
              class="btn btn-primary mt-2"
              class:loading={saving}
              disabled={saving}
              value="Submit Review" />
          </form>
        </div>
    {/if}
    {/if}
  </div>

    const loading = m(".loading.loading-lg")

    const bookCover = m(".flex-initial", m(".container.m-4", [
      when(book.common.image, m("img.img-responsive", {
        src: patchfox.httpUrl("/blobs/get/" + book.common.image.link),
        alt: book.common.image.name
      })),
      when(Array.isArray(book.common.images), m("img.img-responsive", {
        src: patchfox.httpUrl("/blobs/get/" + book.common.images[0].link),
        alt: book.common.images[0].name
      })),
      when(book.common.images.hasOwnProperty("link"), m("img.img-responsive", {
        src: patchfox.httpUrl("/blobs/get/" + book.common.images.link),
        alt: book.common.images.name
      })),
    ]))

    const bookTitleAndDescription = m(".flex-1", m(".prose", [
      m("h1", book.common.title),
      m("h3.card-subtitle.text-gray", book.common.authors),
      when(book.common.series && book.common.seriesNo, m("h3.card-subtitle.text-gray", `Book #${book.common.seriesNo.replace("#","")} in the ${book.common.series} series.`)),
      when(book.common.series && !book.common.seriesNo, m(h2.card-subtitle.text-gray", `Part of the ${book.common.series} series.`)),
      m.trust(ssb.markdown(book.common.description))
    ]))

    const editButton = m("a.btn.btn-sm", {
      href: patchfox.url("books", "edit", {bookKey: book.key})
    }, "Edit Book")

    const bookMetadata = m(".flex", [
      bookCover,
      bookTitleAndDescription,
      editButton
    ])

    const tabs = [
      tabControls,
      ...tabContents
    ]

    const makeTabButton = (view, label) => {
      return m("li.tab", {
        class: when(currentSubView == view, "tab-active")
      },m("a", {
        onclick: () => {
          vnode.state.currentSubView = view
        }
      }, label))
    }

    const tabControls = m("tabs.tabs-boxed.mb-4", [
      makeTabButton("readers-and-reviews", "Readers & Reviews"),
      makeTabButton("new-review", "Submit Review")
    ])

    const tabContents = [
      when(currentSubView == "readers-and-reviews", readersAndReviews),
      when(currentSubView == "new-review", newReview)
    ]

    const readersAndReviews = m("div", [
      m("h3.uppercase.font-medium", "Readers"),
      m(AvatarContainer, book.readers.map(readers => m(AvatarRound, {feed: reader}))),
      m("br"),
      m("h3.uppercase.font-medium", "Reviews"),
      
    ])

    return m(".container.mx-auto.lg:px-4", [
      m("a.btn.btn-sm.btn-ghost.mb-2", {
        href: patchfox.url("books")
      }, "Go Back To Book List"),
      !vnode.state.book ? loading : [bookMetadata, ...tabs]
    ])


}
}

module.exports = BookDetails
