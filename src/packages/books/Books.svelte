<script>
  const pull = require("pull-stream")
  const { timestamp } = require("../../core/components/timestamp.js")
  const Book = require("scuttle-book")
  const book = Book(ssb.sbot)

  let books = []
  let shouldReverse = true

  const fetchBooks = () => {
    books = []
    pull(
      book.pull.books({reverse:shouldReverse}, true, false),
      pull.drain((data) => {
        books.push(data)
        books = books
      })
    )
  }

  const sortByOldest = () => {
    shouldReverse = false
    fetchBooks()
  }

  const sortByNewest = () => {
    shouldReverse = true
    fetchBooks()
  }

  fetchBooks()



</script>

<div class="container">
    <div class="flex mb-4">
      <a class="btn" href="{patchfox.url('books', 'edit')}">Add New Book</a>
      <span class="flex-1 p-2 text-center">{books.length} books found on SSB.</span>
      <div class="btn-group">
        <button class="btn" class:btn-active={!shouldReverse} on:click={sortByOldest}>Sort by oldest additions</button>
        <button class="btn" class:btn-active={shouldReverse} on:click={sortByNewest}>Sort by newest additions</button>
      </div>
    </div>

    {#if books.length == 0}
      <div class="loading" />
    {:else}
      <div class="grid grid-cols-4 gap-4">
        {#each books as book}
          <div class="item">
              <div class="card shadow-sm bg-accent text-accent-content">
                {#if book.common.image}
                <figure class="flex-shrink">
                  <img  src="{patchfox.httpUrl('/blobs/get/' + book.common.image.link)}" alt="{book.common.image.name}">
                </figure>
                {:else if Array.isArray(book.common.images) && book.common.images[0].hasOwnProperty("link")}
                <figure class="flex-shrink">
                  <img  src="{patchfox.httpUrl('/blobs/get/' + book.common.images[0].link)}" alt="{book.common.images[0].name}">
                </figure>
                {:else if book.common.images.hasOwnProperty("link")}
                <figure class="flex-shrink">
                  <img  src="{patchfox.httpUrl('/blobs/get/' + book.common.images.link)}" alt="{book.common.images.name}">
                </figure>

                {:else}
                {@debug book}
                {/if}
                <div class="card-body">
                  <div class="card-title uppercase font-medium">
                    {book.common.title}
                  </div>
                  <div class="card-subtitle text-gray">
                    {book.common.authors}
                  </div>
                  {#if book.common.series && book.common.seriesNo}
                  <div class="card-subtitle text-gray">
                    Book #{#if typeof book.common.seriesNo == "string"}{book.common.seriesNo.replace("#",'')}{:else}{book.common.seriesNo}{/if} in the {book.common.series} series.
                  </div>
                  {:else if book.common.series }
                  <div class="card-subtitle text-gray">
                    Part of {book.common.series} series.
                  </div>
                  {/if}
                
                  <div class="prose">
                  {@html ssb.markdown(book.common.description.slice(0, 200).replace(/h1/gi, "h3") + "...")}
                  
                  <div>
                    {#if book.readers}
                    <span class="text-gray">{book.readers.length} <i class="fas fa-user"></i></span>
                    {/if} 

                    {#if book.reviews }
                    <span class="text-gray ml-2">{Object.keys(book.reviews).length} <i class="fas fa-file-alt"></i> </span>
                    {/if}

                    <span class="ml-2">{timestamp(book.msg.timestamp)}</span>
                  </div>

                </div>
                <div class="card-actions">
                  <a
                    href={patchfox.url("books", "details", { bookKey: book.msg.key })}
                    class="btn btn-primary">
                    Read more
                  </a>
                </div>
              </div>
          </div>
        </div>
        {/each}
        </div>
    {/if}
</div>
