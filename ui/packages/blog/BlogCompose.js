const m = require("mithril")
const drop = require("drag-and-drop-files")
const { getPref } = require("../../core/kernel/prefs.js")
const { when } = require("../../core/kernel/utils.js")
const AvatarChip = require("../../core/components/AvatarChip.js")
const Preview = require("./BlogComposePreview.js")
const pull = require("pull-stream")
const fileReader = require("pull-file-reader")
const Tribute = require("tributejs")

const readFileAndAttach = (vnode, files) => {
  vnode.state.error = false
  vnode.state.msg = ""

  if (files.length == 0) {
    vnode.state.fileOnTop = false
    console.log("this is not a file")
    m.redraw()
    return false
  }

  var first = files[0]

  if (!first.type.startsWith("image")) {
    vnode.state.error = true
    vnode.state.msg = `You can only drag & drop image, this file is a ${first.type}`
    m.redraw()
    return false
  }

  if (first.size >= 5000000) {
    vnode.state.error = true
    vnode.state.msg = `File too large: ${Math.floor(first.size / 1048576, 2)}mb when max size is 5mb`
    m.redraw()
    return false
  }

  ssb
    .addBlob(first)
    .then(hash => {
      vnode.state.content += ` ![${first.name}](${hash})`
      vnode.state.fileOnTop = false
      m.redraw()
    })
    .catch(err => {
      vnode.state.error = true
      vnode.state.msg = "Couldn't attach file: " + err
      vnode.state.fileOnTop = false
      m.redraw()
    })
}

const BlogCompose = {
  oninit: vnode => {
    vnode.state.showPreview = false
    vnode.state.msg = ""
    vnode.state.error = false
    vnode.state.posting = false
    vnode.state.fileOnTop = false
    vnode.state.showContentWarningField = false
    vnode.state.contentWarning = ""

    vnode.state.channel = vnode.attrs.channel || ""
    vnode.state.content = vnode.attrs.content || ""
    vnode.state.summary = vnode.attrs.summary || ""
    vnode.state.title = vnode.attrs.title || ""
    vnode.state.thumbnail = vnode.attrs.thumbnail || false
  },
  oncreatee: vnode => {
    drop(document.getElementById("content"), files => readFileAndAttach(vnode, files))

    let usersObjs = ssb.getAllCachedUsers()
    let users = []
    for (let id in usersObjs) {
      users.push({
        key: usersObjs[id].name,
        value: `[@${usersObjs[id].name}](${usersObjs[id].id})`,
      })
    }
    const tribute = new Tribute({
      values: users,
      selectTemplate: function (item) {
        return item.original.value
      },
    })

    tribute.attach(document.getElementById("content"))
    tribute.attach(document.getElementById("summary"))
  },
  view: vnode => {
    let showPreview = vnode.state.showPreview
    let msg = vnode.state.msg
    let error = vnode.state.error
    let posting = vnode.state.posting

    let channel = vnode.state.channel
    let content = vnode.state.content
    let summary = vnode.state.summary
    let title = vnode.state.title
    let thumbnail = vnode.state.thumbnail
    let contentWarning = vnode.state.contentWarning

    let fileOnTop = vnode.state.fileOnTop
    let sbot = ssb.sbot
    let textSize = getPref("composeSize", "text")

    patchfox.title("compose new blog post")

    const post = async ev => {
      ev.stopPropagation()
      ev.preventDefault()

      if (!vnode.state.posting) {
        vnode.state.posting = true

        if (channel.length > 0 && channel.startsWith("#")) {
          channel = channel.slice(1)
        }

        try {
          let data = {}
          data.content = content
          if (typeof channel == "string" && channel.length > 0) data.channel = channel
          if (typeof title == "string" && title.length > 0) data.title = title
          if (typeof summary == "string" && summary.length > 0) data.summary = summary
          if (thumbnail) data.thumbnail = thumbnail
          if (typeof contentWarning == "string" && contentWarning.length > 0) data.contentWarning = contentWarning

          console.log("about to blog", data)
          vnode.state.msg = await ssb.newBlogPost(data)
          vnode.state.posting = false
          console.log("blogged", msg)
          window.scrollTo(0, 0)
          m.redraw()
        } catch (n) {
          vnode.state.error = true
          vnode.state.msg = `Couldn't post your blog: ${n}`
          window.scrollTo(0, 0)
          m.redraw()
        }
      }
    }

    const preview = ev => {
      vnode.state.showPreview = true
    }

    const dragOver = ev => {
      vnode.state.fileOnTop = true
    }

    const dragLeave = ev => {
      vnode.state.fileOnTop = false
    }

    const attachFileTrigger = () => {
      document.getElementById("fileInput").click()
    }

    const attachThumbnailTrigger = () => {
      document.getElementById("thumbnailInput").click()
    }

    const attachFile = ev => {
      const files = ev.target.files
      readFileAndAttach(vnode, files)
    }

    const attachThumbnail = ev => {
      const files = ev.target.files
      readFileAndAttachThumbnail(files)
    }

    const readFileAndAttachThumbnail = files => {
      vnode.state.error = false
      vnode.state.msg = ""

      if (files.length == 0) {
        console.log("this is not a file")
        return false
      }

      var first = files[0]
      console.log(first)

      if (!first.type.startsWith("image")) {
        vnode.state.error = true
        vnode.state.msg = `You can use images as thumbnail, this file is a ${first.type}`
        m.redraw()
        return false
      }

      if (first.size >= 5000000) {
        vnode.state.error = true
        vnode.state.msg = `File too large: ${Math.floor(first.size / 1048576, 2)}mb when max size is 5mb`
        m.redraw()
        return false
      }

      ssb
        .addBlob(first)
        .then(hash => {
          vnode.state.thumbnail = hash
          vnode.state.fileOnTop = false
          m.redraw()
        })
        .catch(err => {
          vnode.state.error = true
          vnode.state.msg = "Couldn't attach file: " + err
          vnode.state.fileOnTop = false
          m.redraw()
        })
    }

    const toggleContentWarning = () => {
      vnode.state.showContentWarningField = !vnode.state.showContentWarningField
    }

    const toasters = when(
      msg,
      error
        ? m(".alert.alert-error", msg)
        : m(
            ".alert.alert-success",
            m(".flex", [
              "Your blog post has been posted. Do you want to ",
              m(
                "a.link",
                {
                  href: patchfox.url("hub", "thread", { thread: msg.key }),
                },
                " check it out?"
              ),
            ])
          )
    )

    const previewView = [
      m(Preview, {
        channel,
        title,
        summary,
        content,
        contentWarning,
        thumbnail,
      }),
      m(".divider"),
      m(".alert.alert-warning", [
        m(".flex-1", m("label", "This blog post will be public and can't be edited or deleted")),
        m(".flex-none", [
          m(
            "button.btn.btn-sm.btn-ghost",
            {
              onclick: () => {
                vnode.state.showPreview = false
              },
            },
            "Go back"
          ),
          m(
            "button.btn.btn-sm.btn-primary.ml-2",
            {
              class: vnode.state.posting ? "loading" : "",
              disabled: !vnode.state.error && typeof vnode.state.msg.key == "string",
              onclick: post,
            },
            "Post"
          ),
        ]),
      ]),
    ]

    const formView = () => {
      const channelInput = m(".form-control", [
        m("label.label", { for: "channel" }, m("span.label-text", "Channel")),
        m("input.input.input-bordered", {
          type: "text",
          id: "channel",
          placeholder: "channel",
          value: vnode.state.channel,
          onchange: ev => {
            vnode.state.channel = ev.target.value
          },
        }),
      ])

      const titleInput = m(".form-control", [
        m("label.label", { for: "title" }, m("span.label-text", "Title")),
        m("input.input.input-bordered", {
          type: "text",
          id: "title",
          placeholder: "Post title",
          value: vnode.state.title,
          onchange: ev => {
            vnode.state.title = ev.target.value
          },
        }),
      ])

      const fileOnTop = vnode.state.fileOnTop ? "file-on-top" : ""

      const summaryField = m(".form-control", [
        m("label.label", m("span.label-text", "Summary")),
        m("textarea", {
          class: `${textSize} textarea textarea-bordered h-30`,
          id: "summary",
          placeholder: "Type in a summary for your post",
          value: vnode.state.summary,
          onchange: ev => {
            vnode.state.summary = ev.target.value
          },
        }),
      ])

      const postEditor = m(".form-control", [
        m("label.label", m("span.label-text", "Post")),
        m("textarea", {
          class: `${textSize} ${fileOnTop} textarea textarea-bordered h-80`,
          id: "content",
          placeholder: "Type in your post",
          ondragover: dragOver,
          ondragleave: dragLeave,
          value: vnode.state.content,
          onchange: ev => {
            vnode.state.content = ev.target.value
          },
        }),
      ])

      const contentWarning = m(".d-block.m-1", [
        m(
          "button.btn.btn-link",
          {
            onclick: toggleContentWarning,
          },
          "Add Content Warning"
        ),
        when(
          vnode.state.showContentWarningField,
          m("input.input.input-bordered", {
            type: "text",
            size: 50,
            value: vnode.state.contentWarning,
            placeholder: "Describe your content warning (leave empty to not use it)",
            onchange: ev => {
              vnode.state.contentWarning = ev.target.value
            },
          })
        ),
      ])

      const fileInput = [
        m("input.file-attachment-input", {
          type: "file",
          onchange: attachFile,
          id: "fileInput",
        }),
        m(
          "button.btn",
          {
            onclick: attachFileTrigger,
          },
          "Attach File"
        ),
      ]

      const thumbnailInput = [
        when(
          vnode.state.thumbnail,
          m(".block.m-2", [
            m("p", "Thumbnail"),
            m("img.thumbnail-preview", {
              src: patchfox.blobUrl(vnode.state.thumbnail),
            }),
          ])
        ),
        m("input.file-attachment-input", {
          type: "file",
          oninput: attachThumbnail,
          id: "thumbnailInput",
        }),
        m(
          "button.btn.ml-2",
          {
            onclick: attachThumbnailTrigger,
          },
          "Attach Thumbnail Image"
        ),
      ]

      return m("div", [
        channelInput,
        titleInput,
        summaryField,
        postEditor,
        contentWarning,
        fileInput,
        thumbnailInput,
        m(
          "button.btn.btn-primary.float-right",
          {
            onclick: preview,
          },
          "Preview"
        ),
      ])
    }

    return [toasters, showPreview ? previewView : formView()]
  },
}

module.exports = BlogCompose
