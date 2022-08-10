const m = require("mithril")
const { when } = require("../../core/kernel/utils.js")
const drop = require("drag-and-drop-files")
const AvatarChip = require("../../core/components/AvatarChip.js")
const MessageRenderer = require("../../core/components/MessageRenderer.js")
const Spinner = require("../../core/components/Spinner.js")

const { getPref } = require("../../core/kernel/prefs.js")
const pull = require("pull-stream")
const fileReader = require("pull-file-reader")
const Tribute = require("tributejs")

const PostCompose = {
  oninit: vnode => {
    vnode.state.root = vnode.attrs.root || false
    vnode.state.branch = vnode.attrs.branch || false
    vnode.state.channel = vnode.attrs.channel || ""
    vnode.state.content = vnode.attrs.content || ""
    vnode.state.replyfeed = vnode.attrs.replyfeed || false
    vnode.state.fork = vnode.attrs.fork || false

    vnode.state.fileOnTop = false
    vnode.state.sbot = ssb.sbot
    vnode.state.showContentWarningField = false
    vnode.state.contentWarning = ""
    vnode.state.showPreview = false
    vnode.state.msg = false
    vnode.state.error = false
    vnode.state.posting = false
    vnode.state.branchedMsg = false

    if (vnode.state.branch) {
      ssb.get(vnode.state.branch).then(data => {
        vnode.state.branchedMsg = { key: vnode.state.branch, value: data }
        m.redraw()
      })
    }
  },
  oncreate: vnode => {
    // this code could be in some better/smarter place.
    // e.dataTransfer.getData('url') from images in the browser window

    const readFileAndAttach = files => {
      try {
        vnode.state.error = false
        vnode.state.msg = ""

        if (files.length == 0) {
          vnode.state.fileOnTop = false
          m.redraw()
          return false
        }

        var first = files[0]

        if (!first.type.startsWith("image") && !first.type.startsWith("video") && !first.type.startsWith("audio")) {
          vnode.state.error = true
          vnode.state.msg = `You can only drag & drop images, videos, or audio, this file is a ${first.type}`
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
            console.log("hash from drop", hash)
            switch (first.type) {
            case "image/png":
            case "image/jpeg":
            case "image/gif":
            case "image/svg":
              vnode.state.content += ` ![${first.name}](${hash})`
              break
            case "video/mp4":
              vnode.state.content += ` ![video:${first.name}](${hash})`
              break
            case "audio/mp3":
              vnode.state.content += ` ![audio:${first.name}](${hash})`
              break
            }
            vnode.state.fileOnTop = false
            m.redraw()
          })
          .catch(err => {
            vnode.state.error = true
            vnode.state.msg = "Couldn't attach file: " + err
            vnode.state.fileOnTop = false
            m.redraw()
          })
      } catch (n) {
        console.error("error, attaching", n)
        m.redraw()
      }
    }

    drop(document.getElementById("content"), files => readFileAndAttach(files))

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

    if (vnode.state.replyfeed && vnode.state.content.length == 0) {
      vnode.state.content += `[${usersObjs[vnode.state.replyfeed].name}](${vnode.state.replyfeed}),\n`
    }

    tribute.attach(document.getElementById("content"))
  },
  view: vnode => {
    let textSize = getPref("composeSize", "text")

    patchfox.title(`New Post`)


    // TODO: This function is duplicated. 
    // O problema é passar o vnode nessa função caso ela esteja fora.

    const readFileAndAttach = files => {
      try {
        vnode.state.error = false
        vnode.state.msg = ""

        if (files.length == 0) {
          vnode.state.fileOnTop = false
          m.redraw()
          return false
        }

        var first = files[0]

        if (!first.type.startsWith("image") && !first.type.startsWith("video") && !first.type.startsWith("audio")) {
          vnode.state.error = true
          vnode.state.msg = `You can only drag & drop images, videos, or audio, this file is a ${first.type}`
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
            console.log("hash from view", hash)
            switch (first.type) {
            case "image/png":
            case "image/jpeg":
            case "image/gif":
            case "image/svg":
              vnode.state.content += ` ![${first.name}](${hash})`
              break
            case "video/mp4":
              vnode.state.content += ` ![video:${first.name}](${hash})`
              break
            case "audio/mp3":
              vnode.state.content += ` ![audio:${first.name}](${hash})`
              break
            }
            vnode.state.fileOnTop = false
            m.redraw()
          })
          .catch(err => {
            vnode.state.error = true
            vnode.state.msg = "Couldn't attach file: " + err
            vnode.state.fileOnTop = false
            m.redraw()
          })
      } catch (n) {
        console.error("error, attaching", n)
        m.redraw()
      }
    }

    const post = async ev => {
      ev.stopPropagation()
      ev.preventDefault()

      if (!vnode.state.posting) {
        vnode.state.posting = true

        if (vnode.state.channel && vnode.state.channel.length > 0 && vnode.state.channel.startsWith("#")) {
          vnode.state.channel = vnode.state.channel.slice(1)
        }

        try {
          let data = {}
          data.text = vnode.state.content
          if (typeof vnode.state.channel == "string" && vnode.state.channel.length > 0) data.channel = vnode.state.channel
          if (vnode.state.root) data.root = vnode.state.root
          if (vnode.state.fork) data.fork = vnode.state.fork
          if (vnode.state.branch) data.branch = vnode.state.branch
          if (typeof vnode.state.contentWarning == "string" && vnode.state.contentWarning && vnode.state.contentWarning.length > 0) data.contentWarning = vnode.state.contentWarning

          vnode.state.msg = await ssb.newPost(data)
          vnode.state.posting = false
          window.scrollTo(0, 0)
          m.redraw()
        } catch (n) {
          vnode.state.error = true
          vnode.state.msg = `Couldn't post your message: ${n}`
          console.error("Couldn't post", n)
          window.scrollTo(0, 0)
          m.redraw()

          if (vnode.state.msg.message === "stream is closed") {
            vnode.state.msg += ". We lost connection to SSB Server. We'll try to restablish it..."
            window.reload()
          }
        }
      }
    }

    const preview = ev => {
      vnode.state.showPreview = true
      m.redraw()
    }

    const avatarClick = ev => {
      let feed = ev.detail.feed
      let name = ev.detail.name

      if (vnode.state.content.length > 0) {
        vnode.state.content += ` [${name}](${feed})`
      } else {
        vnode.state.content = `[${name}](${feed})`
      }

      m.redraw()
    }

    const dragOver = ev => {
      vnode.state.fileOnTop = true
      m.redraw()
    }

    const dragLeave = ev => {
      vnode.state.fileOnTop = false
      m.redraw()
    }

    const attachFileTrigger = () => {
      document.getElementById("fileInput").click()
    }

    const attachFile = ev => {
      const files = ev.target.files
      readFileAndAttach(files)
    }

    const toggleContentWarning = () => {
      vnode.state.showContentWarningField = !vnode.state.showContentWarningField
      m.redraw()
    }

    const ErrorOrMessage = () => {
      if (vnode.state.msg && vnode.state.error) {
        return m(".alert.alert-error", vnode.state.msg)
      }

      if (vnode.state.msg) {
        return m(
          ".alert.alert-success",
          m(
            ".flex-1",
            m("label", [
              "Your message has been posted. Do you want to",
              m(
                "a.ml-2",
                {
                  href: patchfox.url("hub", "thread", { thread: vnode.state.msg.key }),
                  class: "link",
                },
                "check it out?"
              ),
            ])
          )
        )
      }
    }

    const PreviewView = () => {
      if (vnode.state.showPreview) {
        return m("div", [
          m("h2.uppercase.font-medium.text-md", "Post Preview"),
          m(".prose", [when(vnode.state.channel, m("p.text-md", `Channel: ${vnode.state.channel.startsWith("#") ? vnode.state.channel.slice(1) : vnode.state.channel}`)), when(vnode.state.root, m("p.text-md", `Root: ${vnode.state.root}`)), when(vnode.state.branch, m("p.text-md", `In Reply To: ${vnode.state.branch}`)), when(vnode.state.contentWarning.length > 0, m("p.text-md", `Content Warning: ${vnode.state.contentWarning}`))]),
          m.trust(ssb.markdown(vnode.state.content)),
          m(".divider"),
          m(".alert.alert-warning", [
            m(".flex-1", m("label", "This message will be public and can't be edited or deleted")),
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
        ])
      }
    }

    const FormView = () => {
      const channelInput = m(".form-control", [
        m("label.label", { for: "channel" }, m("span.label-text", "Channel")),
        m("input.input.input-bordered", {
          type: "text",
          id: "channel",
          placeholder: "channel",
          value: vnode.state.channel,
          onchange: ev => {
            vnode.state.channel = ev.target.value
            m.redraw()
          },
        }),
      ])

      const replyInput = m(".form-control", [
        m("label.label", { for: "reply-to" }, m("span.label-text", "In reply to")),
        m("input.input.input-bordered.mb-2", {
          type: "text",
          id: "reply-to",
          placeholder: "in reply to...",
          value: vnode.state.branch,
          onchange: ev => {
            vnode.state.branch = ev.target.value
          },
        }),
        when(vnode.state.branch && vnode.state.branchedMsg, m(MessageRenderer, { msg: vnode.state.branchedMsg })),
        when(vnode.state.branch && !vnode.state.branchedMsg, m(Spinner)),
      ])

      const fileOnTop = vnode.state.fileOnTop ? "file-on-top" : ""

      const messageArea = m(".form-control", [
        m("label.label", m("span.label-text", "Message")),
        m(
          "textarea",
          {
            class: `${textSize} ${fileOnTop} textarea textarea-bordered h-80`,
            id: "content",
            placeholder: "Type in your post",
            ondragover: dragOver,
            ondragleave: dragLeave,
            value: vnode.state.content,
            onchange: ev => {
              vnode.state.content = ev.target.value
            },
          },
        ),
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
            onchange: (ev) => {
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
        m("button.btn", {
          onclick: attachFileTrigger,
        }, "Attach File"),
      ]

      if (!vnode.state.showPreview) {
        return m("div", [
          channelInput,
          when(vnode.state.branch, replyInput),
          messageArea,
          contentWarning,
          fileInput,
          m("button.btn.btn-primary.float-right", {
            onclick: preview,
          }, "Preview"),
        ])
      }
    }

    return m(".container.mx-auto", [when(vnode.state.fork, m(".alert.alert-warning", `You are forking: ${vnode.state.fork}`)), ErrorOrMessage(), PreviewView(), FormView()])
  },
}

module.exports = PostCompose
