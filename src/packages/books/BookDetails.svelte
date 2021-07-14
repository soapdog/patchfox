<script>
  const pull = require("pull-stream");
  const { timestamp } = require("../../core/components/timestamp.js");
  const Book = require("scuttle-book")
  const b = Book(ssb.sbot)
  const AvatarChip = require("../../core/components/AvatarChip.svelte");


  export let bookKey = false;

  let book = false
  let currentSubView = "readers-and-reviews"

  const fetchBook = () => {
    b.async.get(bookKey, true, (err, data) => {
      console.log(data)
      book = data

      if (book.reviews[ssb.feed].rating !== "" || book.reviews[ssb.feed].review) {
        newRating = book.reviews[ssb.feed].rating || ""
        newRatingType = book.reviews[ssb.feed].ratingType || ":star:"
        newRatingMax = book.reviews[ssb.feed].ratingMax || "5"
        newReviewText = book.reviews[ssb.feed].review || ""
        newShelves = book.reviews[ssb.feed].shelves.join(", ") || ""
      }
    })
  }

  const avatarClick = ev => {
    let feed = ev.detail.feed;

    patchfox.go("contacts", "profile", { feed });
  };

  let newRating = ""
  let newRatingType = ":star:"
  let newRatingMax = "5"
  let newReviewText = ""
  let newShelves = ""
  let saving = false

  const newReview = () => {
    saving = true

    let bookRating = { 
      type: "bookclubUpdate", 
      review: newReviewText, 
      rating: newRating, 
      ratingMax: newRatingMax, 
      ratingType: newRatingType,
      shelves: newShelves.split(",").map((i) => i.trim())  
    }

    b.async.update(bookKey, bookRating, (err, updateMsg) => {
      if (!err) {
        saving = false
        fetchBook()
        currentSubView = "readers-and-reviews"
      }
    })
  }

  fetchBook()
</script>

<style>  
.cyberpunk-container {
  max-width: 840px;
  margin: auto;
}

.review {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

/* from: https://projects.verou.me/bubbly/ */
.speech-bubble {
	position: relative;
	background: #feffff;
	border-radius: .4em;
  margin-left: 10px;
  width: 100%;
  min-height: 70px;
}

.speech-bubble:after {
	content: '';
	position: absolute;
	left: 0;
	top: 50%;
	width: 0;
	height: 0;
	border: 15px solid transparent;
	border-right-color: #feffff;
	border-left: 0;
	margin-top: -15px;
	margin-left: -15px;
}
</style>
<div class="cyberpunk-container" augmented-ui="tr-clip-x br-clip-x exe">
  <div class="container">
    <span class="chip"><a href="{patchfox.url('books')}">Go Back To Book List</a></span>
    {#if book == false}
    <div class="loading loading-lg" />
    {:else}
    <div class="columns">
      <div class="column col-6">
        <div class="container">
          {#if book.common.image}
            <img class="img-responsive" src="{patchfox.httpUrl('/blobs/get/' + book.common.image.link)}" alt="{book.common.image.name}">
          {:else if Array.isArray(book.common.images)}
            <img class="img-responsive" src="{patchfox.httpUrl('/blobs/get/' + book.common.images[0].link)}" alt="{book.common.images[0].name}">
          {:else if book.common.images.hasOwnProperty("link")}
            <img class="img-responsive" src="{patchfox.httpUrl('/blobs/get/' + book.common.images.link)}" alt="{book.common.images.name}">
          {/if}
        </div>
      </div>
      <div class="column col-6">
        <h1>
          {book.common.title}
        </h1>
        <h3 class="card-subtitle text-gray">
          {book.common.authors}
        </h3>
        {#if book.common.series && book.common.seriesNo}
        <h3 class="card-subtitle text-gray">
          Book #{book.common.seriesNo.replace("#",'')} in the {book.common.series} series.
        </h3>
        {:else if book.common.series }
        <h3 class="card-subtitle text-gray">
          Part of {book.common.series} series.
        </h3>
        {/if}
        <p>
          {@html ssb.markdown(book.common.description)}
        </p>
        <a class="btn btn-primary" href="{patchfox.url('books', 'edit', {bookKey: book.key})}">Edit Book</a>

      </div>
    </div>
    <br/>
    <ul class="tab tab-block">
      <li class="tab-item" class:active={currentSubView === 'readers-and-reviews'}>
        <a href="#" on:click|preventDefault={() => (currentSubView = 'readers-and-reviews')}>
          Readers & Reviews
        </a>
      </li>
      <li class="tab-item" class:active={currentSubView === 'new-review'}>
        <a href="#" on:click|preventDefault={() => (currentSubView = 'new-review')}>
          Submit Review
        </a>
      </li>
    </ul>
    {#if currentSubView === "readers-and-reviews"}
    {#if book.readers}
      <h3>Readers</h3>
      {#each book.readers as reader}
        <AvatarChip feed={reader} on:avatarClick={avatarClick} />
      {/each}
    {/if}
    <br/>
    <h3>Reviews</h3>
      {#each Array.from(Object.entries(book.reviews)) as [reader, review]}
          {#if review.key !== ""}
          <div class="review">
            <div>
              <AvatarChip feed={reader} on:avatarClick={avatarClick} />
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
                {@html ssb.markdown(review.review)}
              {/if}
              {#if review.shelves && review.shelves !== ""}
              <p><b>Shelved in: </b> {#if Array.isArray(review.shelves)}{review.shelves.join(", ")}{:else}{review.shelves}{/if}</p>
              {/if}
            </div>
          </div>
        </div>
        {/if}
      {/each}
    {:else if currentSubView === "new-review"}
        <div>
          <h2 class="title">Submit Review</h2>
          <form on:submit|preventDefault={newReview}>
            <div class="form-group">
              <label class="form-label" for="field-rating">Rating</label>
              <input
                class="form-input"
                type="text"
                id="field-rating"
                bind:value={newRating}
                placeholder="Rating" />
            </div>
            <div class="form-group">
              <label class="form-label" for="field-rating-type">Type</label>
              <input
                class="form-input"
                type="text"
                id="field-rating-type"
                bind:value={newRatingType}
                placeholder="Rating Type" />
            </div>
            <div class="form-group">
              <label class="form-label" for="field-rating-max">Rating Maximum Value</label>
              <input
                class="form-input"
                type="text"
                id="field-rating-max"
                bind:value={newRatingMax}
                placeholder="" />
            </div>
            <div class="form-group">
              <label class="form-label" for="field-review">Review</label>
              <textarea bind:value={newReviewText} class="form-input" id="field-review" placeholder="Textarea" rows="5"></textarea>
            </div>
            <div class="form-group">
              <label class="form-label" for="field-shelves">Shelves</label>
              <input
                class="form-input"
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
</div>
