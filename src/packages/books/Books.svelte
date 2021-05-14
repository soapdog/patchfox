<script>
import { claim_component } from "svelte/internal";

  const pull = require("pull-stream");
  const paramap = require("pull-paramap");
  const sort = require("pull-sort");
  const { onDestroy, tick } = require("svelte");
  const { timestamp } = require("../../core/components/timestamp.js");
  const Book = require("scuttle-book")
  const book = Book(ssb.sbot)

  export let filter = "everyone";
  export let channel = false;
  let sbot = ssb.sbot;
  let books = [];
  let limit = 20;

  const fetchBooks = () => {
    pull(
      book.pull.books(null, true, false),
      pull.drain((data) => {
        books.push(data)
        books = books
        console.log(data)
      })
    )
  }

  fetchBooks()


</script>

<style>  
  .masonry {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-template-rows: masonry;
  }
</style>

<div class="container">
  <div class="zine">
    {#if books.length == 0}
      <div class="loading" />
    {:else}
      <div class="masonry">
        {#each books as book}
          <div class="item">
              <div class="card">
                {#if book.common.image}
                <div class="card-image">
                  <img class="img-responsive" src="{patchfox.httpUrl('/blobs/get/' + book.common.image.link)}" alt="{book.common.image.name}">
                </div>
                {:else if book.common.images}
                <div class="card-image">
                  <img class="img-responsive" src="{patchfox.httpUrl('/blobs/get/' + book.common.images[0].link)}" alt="{book.common.images[0].name}">
                </div>
                {/if}
                <div class="card-header">
                  <div class="card-title h5">
                    {book.common.title}
                  </div>
                  <div class="card-subtitle text-gray">
                    {book.common.authors}
                  </div>
                  {#if book.common.series && book.common.seriesNo}
                  <div class="card-subtitle text-gray">
                    Book #{book.common.seriesNo.replace("#",'')} in the {book.common.series} series.
                  </div>
                  {:else if book.common.series }
                  <div class="card-subtitle text-gray">
                    Part of {book.common.series} series.
                  </div>
                  {/if}
                </div>
                <div class="card-body">
                  {@html ssb.markdown(book.common.description.slice(0, 200).replace(/h1/gi, "h3") + "...")}
                  {#if book.readers}
                  <p class="text-gray">{book.readers.length} readers.</p>
                  {/if} 
                  {#if book.reviews }
                  <p class="text-gray">{Object.keys(book.reviews).length} reviews. </p>
                  {/if}
                </div>
                <div class="card-footer">
                  <span class="float-left">{timestamp(book.msg.timestamp)}</span>
                  
                  <a
                    href={patchfox.url('hub', 'thread', { thread: book.msg.key })}
                    class="btn btn-link float-right">
                    &rarr;
                  </a>
                </div>
              </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
