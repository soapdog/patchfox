const BooksView = require("./BooksView.js")
const BookDetails = require("./BookDetails.js")
const BookEdit = require("./BookEdit.js")
const BookCard = require("./BookCard.js")

patchfox.package({
  name: "books",
  app: true,
  icon: "books.svg",
  supportedPlatforms: ["nodejs-db1"],
  view: BooksView,
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
