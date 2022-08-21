const m = require("mithril")
const Card = require("../../core/components/Card.js")
const VoteCounter = require("../../core/components/VoteCounter.js")
const { when } = require("../../core/kernel/utils.js")

const BlogCard = {
  oninit: vnode => {
    vnode.state.showBlogpost = false
    vnode.state.loading = false
    vnode.state.toast = false
    vnode.state.toastMsg = ""
    vnode.state.showRaw = false

    let msg = vnode.attrs.msg
    let content = msg.value.content
    let summary = ssb.markdown(content.summary)

    vnode.state.post = summary
    vnode.state.hasContentWarning = content.contentWarning && content.contentWarning.length > 0
    vnode.state.liked = false
    vnode.state.key = Date.now()

    ssb.votes(msg.key).then(ms => {
      vnode.state.liked = ms.includes(ssb.feed)
      m.redraw()
    })
  },
  view: vnode => {
    console.log("hit")
    let msg = vnode.attrs.msg
    let showRaw = vnode.state.showRaw
    let post = vnode.state.post
    let key = vnode.state.key

    let content = msg.value.content

    let summary = ssb.markdown(content.summary)
    let thumbnail = content.thumbnail || false
    let encodedThumbnail = encodeURIComponent(thumbnail) || false
    let title = content.title || false


    const likeChanged = ev => {
      let v = ev.target.checked
      if (v) {
        ssb
          .like(msg.key)
          .then(() => {
            vnode.state.liked = true
            vnode.state.key = Date.now()
            m.redraw()
          })
          .catch(() => {
            vnode.state.liked = false
            vnode.state.key = Date.now()
            m.redraw()
          })
      } else {
        ssb
          .unlike(msg.key)
          .then(() => {
            vnode.state.liked = false
            m.redraw()
          })
          .catch(() => {
            vnode.state.liked = true
            m.redraw()
          })
      }
    }

    const displayBlogPost = ev => {
      vnode.state.loading = true

      ssb
        .getBlob(content.blog)
        .then(data => {
          vnode.state.post = ssb.markdown(data)
          vnode.state.showBlogpost = true
          m.redraw()
        })
        .catch(err => {
          console.error("can't load blog post", err)
          vnode.state.toast = true
          vnode.state.toastMsg = err
          m.redraw()
        })
    }

    const reply = ev => {
      let rootId = msg.value.content.root || msg.key
      let channel = msg.value.content.channel
      patchfox.go("post", "compose", { root: rootId, branch: msg.key, channel })
    }

    const fork = ev => {
      let originalRoot = msg.value.content.root || msg.key
      let channel = msg.value.content.channel
      let replyfeed = msg.value.author
      patchfox.go("post", "compose", {
        root: msg.key,
        branch: msg.key,
        fork: originalRoot,
        channel,
        replyfeed,
      })
    }

    const goRoot = ev => {
      let rootId = msg.value.content.root || msg.key
      patchfox.go("hub", "thread", { thread: rootId })
    }

    const goBranch = ev => {
      let branchId = msg.value.content.branch || msg.key
      patchfox.go("hub", "thread", { thread: branchId })
    }

    const actions = [
      m("div.flex.align-middle", [
        m(
          ".form-control.flex-1",
          {key: 1},
          m("label.cursor-pointer.label", [
            m("span.label-text.mr-2", "Like"),
            m("input.toggle", {
              type: "checkbox",
              onchange: likeChanged,
              checked: vnode.state.liked,
            }),
          ])
        ),
        m(VoteCounter, {msg, key}),
      ]),
      m("div.flex-1"),
      when(
        msg.value.content.root,
        m(
          "span",
          m(
            "a.btn.btn-ghost",
            {
              href: `?pkg=hub&view=thread&thread=${encodeURIComponent(
                msg.value.content.root
              )}`,
              onclick: goRoot,
            },
            "Root Message"
          )
        )
      ),
      when(
        msg.value.content.branch,
        m(
          "span",
          m(
            "a.btn.btn-ghost",
            {
              href: `?pkg=hub&view=thread&thread=${encodeURIComponent(
                msg.value.content.branch
              )}`,
              onclick: goBranch,
            },
            "In Reply To"
          )
        )
      ),
      when(!msg.value.private, [
        m(
          "button.btn.btn-primary",
          {
            onclick: fork,
          },
          "Fork"
        ),
        m(
          "button.btn.btn-primary",
          {
            onclick: reply,
          },
          "Reply"
        ),
        vnode.state.showBlogpost ? m("button.btn.btn-primary", {
          onclick: () => vnode.state.showBlogpost = false
        }, "Close blogpost") : m("button.btn.btn-primary", {
          onclick: displayBlogPost
        }, "Read blogpost") 
      ]),
    ]

    return m(Card, {msg, showRaw, actions}, [
      when(thumbnail, m(".card-image", m("img.img-responsive", {src: patchfox.blobUrl(thumbnail), alt: title}))),
      when(title, m("h5.card-title.h5", title)),
      when(vnode.state.toast, m(".toast.toast-error", `Can't load blogpost: ${vnode.state.toastMsg}`)),
      when(vnode.state.hasContentWarning, m(".toast.toast-primary"),m("p", [m("b", "Content warning:"), msg.value.contentWarning])),
      m("article.prose", vnode.state.showBlogpost ? m.trust(post) : m.trust(summary)),
    ])
  },
}

module.exports = BlogCard
