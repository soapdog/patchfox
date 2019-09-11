const Post = require("./Post.svelte");

patchfox.package({
    name: "compose",
    view: Post,
    post: Post,
    menu: [
        {
            group: "Compose",
            items: [
                {
                    label: "Post",
                    event: "package:go",
                    data: {
                        pkg: "compose",
                        view: "post"
                    }
                }
            ]
        }
    ]
})