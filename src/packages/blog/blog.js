const BlogCompose = require("./BlogCompose.svelte");
const BlogCard = require("./BlogCard.svelte");

patchfox.package({
    name: "blog",
    view: BlogCompose,
    compose: BlogCompose,
    messageTypes: [
        {
            type: "blog",
            card: BlogCard,
            compose: BlogCompose
        }
    ],
    menu: [
        {
            group: "Compose",
            items: [
                {
                    label: "Blog",
                    event: "package:go",
                    data: {
                        pkg: "blog",
                        view: "compose"
                    }
                }
            ]
        }
    ]
})