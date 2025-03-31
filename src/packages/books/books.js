const Books = require("./Books.svelte")
const BookDetails = require("./BookDetails.svelte")
const BookEdit = require("./BookEdit.svelte")
const BookCard = require("./BookCard.svelte")

patchfox.package({
  name: "books",
  app: true,
  icon: "books.svg",
  supportedPlatforms: ["nodejs-ssb"],
  view: Books,
  details: BookDetails,
  edit: BookEdit,
  messageTypes: [
    {
      type: "bookclub",
      card: BookCard,
      short: true
    },
    {
      type: "bookclubUpdate",
      card: BookCard,
      short: true
    }
  ],
})
