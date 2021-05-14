<script>
  const Book = require("scuttle-book")
  const b = Book(ssb.sbot)
  const fileReader = require("pull-file-reader")
  const pull = require("pull-stream");



  export let bookKey = false
  let saving = false
  let newTitle = ""
  let newAuthors = ""
  let newDescription = ""
  let newSeries = ""
  let newSeriesNo = ""
  let newImage = false

  const fetchBook = () => {
    b.async.get(bookKey, true, (err, book) => {
      console.log(book)

      if (book.common) {
        newTitle = book.common.title
        newAuthors = Array.isArray(book.common.authors) ? book.common.authors.join(", ") : book.common.authors
        newDescription = book.common.description || ""
        newSeries = book.common.series || ""
        newSeriesNo = book.common.seriesNo || ""
        if (book.common.image && book.common.image.link) {
          newImage = book.common.image.link
        } else if (Array.isArray(book.common.images) && book.common.images[0] && book.common.images[0].link) {
          newImage = book.common.images[0].link
        }
         
      }
    })
  }

  const addNewBook = () => {
    saving = true

    let newBook = { 
      type: 'bookclub', 
      title: newTitle, 
      description: newDescription,
      authors: newAuthors.split(",").map((i) => i.trim()), 
    }

    if (newSeries !== "") {
      newBook.series = newSeries
    }

    if (newSeriesNo !== "") {
      newBook.seriesNo = newSeriesNo
    }

    if (newImage) {
      newBook.image = { link: newImage }
    }

    if (bookKey == false) {
      b.async.create(newBook, (err, bookMsg) => {
        if (!err) {
          saving = false
          console.log(bookMsg)
          patchfox.go('books', 'details', { bookKey: bookMsg.key })
        } else {
          throw err
        }
      })
    }else{
      newBook.type = "bookclubUpdate"
      b.async.update(bookKey, newBook, (err, bookMsg) => {
        if (!err) {
          saving = false
          console.log(bookMsg)
          patchfox.go('books', 'details', { bookKey: bookMsg.key })
        } else {
          throw err
        }
      })
    }
  }

  const readFileAndAttach = files => {
    try {
      if (files.length == 0) {
        return false;
      }

      var first = files[0];
      console.log(first);

      if (!first.type.startsWith("image")) {
        alert(`You can only drag & drop image, this file is a ${first.type}`);
        return false;
      }

      if (first.size >= 5000000) {
        alert(
          `File too large: ${Math.floor(
            first.size / 1048576,
            2
          )}mb when max size is 5mb`
        );
        return false;
      }

      pull(
        fileReader(first),
        ssb.sbot.blobs.add(function(err, hash) {
          if (err) {
            alert("Couldn't attach file: " + err);
          } else {
            newImage = hash;
          }
        })
      );
    } catch (n) {
      console.error("error, attaching", n);
    }
  };

  const attachFile = ev => {
    const files = ev.target.files;
    readFileAndAttach(files);
  };

  if (bookKey) {
    fetchBook()
  }

</script>

<style>  
.cyberpunk-container {
  max-width: 840px;
  margin: auto;
}
</style>
<div class="cyberpunk-container" augmented-ui="tr-clip-x br-clip-x exe">
  <div class="container">
    <span class="chip"><a href="{patchfox.url('books')}">Go Back To Book List</a></span>
    <h2 class="title">{#if !bookKey}Add New Book{:else}Update Book{/if}</h2>
    <form on:submit|preventDefault={addNewBook}>
      {#if newImage}
      <figure>
      <img class="img-responsive" src="{patchfox.httpUrl('/blobs/get/' + newImage)}">
    </figure>
      {/if}
      <div class="form-group">
        <label class="form-label" for="field-title">Cover</label>
        <input
        class="btn btn-link text-center"
        type="file"
        on:input={attachFile}
        id="fileInput" />
      </div>
      <div class="form-group">
        <label class="form-label" for="field-title">Title</label>
        <input
          class="form-input"
          type="text"
          id="field-title"
          bind:value={newTitle}
          placeholder="Book Title" />
      </div>
      <div class="form-group">
        <label class="form-label" for="field-authors">Authors</label>
        <input
          class="form-input"
          type="text"
          id="field-authors"
          bind:value={newAuthors}
          placeholder="Comma-separated list of authors" />
      </div>
      <div class="form-group">
        <label class="form-label" for="field-review">Description</label>
        <textarea bind:value={newDescription} class="form-input" id="field-review" placeholder="Textarea" rows="5"></textarea>
      </div>
      <div class="form-group">
        <label class="form-label" for="field-series">Series</label>
        <input
          class="form-input"
          type="text"
          id="field-series"
          bind:value={newSeries}
          placeholder="series name" />
      </div>
      <div class="form-group">
        <label class="form-label" for="field-series-no">Series</label>
        <input
          class="form-input"
          type="text"
          id="field-series-no"
          bind:value={newSeriesNo}
          placeholder="book number in the series" />
      </div>
      {#if !bookKey}
      <input
        id="save-field-button"
        type="submit"
        class="btn btn-primary mt-2"
        class:loading={saving}
        disabled={saving}
        value="Add New Book" />
      {:else}
        <input
        id="save-field-button"
        type="submit"
        class="btn btn-primary mt-2"
        class:loading={saving}
        disabled={saving}
        value="Update Book" />
      {/if}
    </form>
  </div>
</div>
