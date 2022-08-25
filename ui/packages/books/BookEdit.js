 const m = require("mithril")
  const Book = require("scuttle-book")
  const b = Book(ssb.sbot)
  const fileReader = require("pull-file-reader")
  const pull = require("pull-stream")
  const { timestamp } = require("../../core/components/timestamp.js")
 
 const BookEdit = {
  oninit: vnode => {
    
  },
  view: vnode => {



  let bookKey = vnode.attrs.bookKey
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

        patchfox.title(book.common.title)
         
      }
    })
  }

  const addNewBook = () => {
    saving = true

    let newBook = { 
      type: "bookclub", 
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
          patchfox.go("books", "details", { bookKey: bookMsg.key })
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
          patchfox.go("books", "details", { bookKey: bookMsg.key })
        } else {
          throw err
        }
      })
    }
  }

  const readFileAndAttach = files => {
    try {
      if (files.length == 0) {
        return false
      }

      var first = files[0]
      console.log(first)

      if (!first.type.startsWith("image")) {
        alert(`You can only drag & drop image, this file is a ${first.type}`)
        return false
      }

      if (first.size >= 5000000) {
        alert(
          `File too large: ${Math.floor(
            first.size / 1048576,
            2
          )}mb when max size is 5mb`
        )
        return false
      }

      ssb.addBlob(first)
        .then(hash => {
          newImage = hash
        })
        .catch(err => {
          alert("Couldn't attach file: " + err)
        })
    } catch (n) {
      console.error("error, attaching", n)
    }
  }

  const attachFile = ev => {
    const files = ev.target.files
    readFileAndAttach(files)
  }

  if (bookKey) {
    fetchBook()
  }

</script>
 /**
  <div class="container">
    <a class="btn btn-sm btn-ghost mb-2"href="{patchfox.url('books')}">Go Back To Book List</a>

    <h2 class="uppercase font-medium">{#if !bookKey}Add New Book{:else}Update Book{/if}</h2>

    <form on:submit|preventDefault={addNewBook}>
      {#if newImage}
      <figure>
      <img src="{patchfox.httpUrl('/blobs/get/' + newImage)}">
    </figure>
      {/if}
      <div class="form-control">
        <label class="label" for="field-title"><span class="label-text">Cover</span></label>
        <input
        class="btn btn-link text-center"
        type="file"
        on:input={attachFile}
        id="fileInput" />
      </div>

      <div class="form-control">
        <label class="label" for="field-title"><span class="label-text">Title</span></label>
        <input
          class="input input-bordered"
          type="text"
          id="field-title"
          bind:value={newTitle}
          placeholder="Book Title" />
      </div>

      <div class="form-control">
        <label class="label" for="field-authors"><span class="label-text">Authors</span></label>
        <input
          class="input input-bordered"
          type="text"
          id="field-authors"
          bind:value={newAuthors}
          placeholder="Comma-separated list of authors" />
      </div>

      <div class="form-control">
        <label class="label" for="field-review"><span label="label-text">Description</span></label>
        <textarea class="textarea textarea-bordered" bind:value={newDescription} id="field-review" placeholder="Textarea" rows="5"></textarea>
      </div>

      <div class="form-control">
        <label class="label" for="field-series"><span class="label-text">Series</span></label>
        <input
          class="input input-bordered"
          type="text"
          id="field-series"
          bind:value={newSeries}
          placeholder="series name" />
      </div>

      <div class="form-control">
        <label class="label" for="field-series-no"><span class="label-text">Series</span></label>
        <input
          class="input input-bordered"
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
*/

}

}

module.exports = BookEdit
