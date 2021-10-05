<script>
  const AvatarChip = require("../../core/components/AvatarChip.svelte")
  const Book = require("scuttle-book")
  const b = Book(ssb.sbot)

  export let msg

  let action = ""
  let msgid = msg.value.content.updates || msg.key
  let encodedid = encodeURIComponent(msgid)
  let title = msgid

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
    title = book.common.title
  })

  const goToBook = (ev) => {
    ev.stopPropagation()
    ev.preventDefault()
    if (typeof msgid === "undefined") {
      throw "Can't go to undefined message id"
      return false
    }
    if (ev.ctrlKey) {
      window.open(
        `?pkg=books&view=details&bookKey=${encodeURIComponent(msgid)}`
      )
    } else {
      patchfox.go("books", "details", { bookKey: msgid })
    }
  }
</script>

<p class="m-2">
  <AvatarChip feed={msg.value.author} />
  {action}
  <a href="?pkg=books&view=details&bookKey={encodedid}" on:click={goToBook}>
    {title}
  </a>
</p>
