const Books = require("./Books.svelte")

patchfox.package({
    name: "books",
    app: true,
    icon: "books.svg",
    view: Books
})
