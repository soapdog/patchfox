const m = require("mithril")
const pull = require("pull-stream")
const fileReader = require("pull-file-reader")
const Form = require("../../core/components/daisyui/Form.js")
const TextInput = require("../../core/components/daisyui/TextInput.js")
const TextArea = require("../../core/components/daisyui/TextArea.js")

const ProfileEditor = {
  oninit: vnode => {
    vnode.state.submitting = false
  },
  view: vnode => {
    const onSaveProfile = vnode.attrs?.onSaveProfile
    const onCancelEdit = vnode.attrs?.onCancelEdit

    let description = vnode.attrs?.description || ""
    let name = vnode.attrs?.name || ""
    let image = vnode.attrs?.image || ""
    let feed = vnode.attrs?.feed || ""

    let sbot = ssb.sbot

    const cancel = (ev) => {
      ev.preventDefault()
      onCancelEdit()
    }

    const save = () => {
      let name = document.getElementById("name").value
      let description = document.getElementById("description").value
      let data = { name, description, image: { link: image } }
      vnode.state.submitting = true

      m.redraw()

      ssb
        .setProfileMetadata(data)
        .then(res => {
          console.log("res", res)
          onSaveProfile()
        })
        .catch(err => {
          console.error("err", err)
        })
    }

    const readFileAndAttach = files => {
      try {
        if (files.length == 0) {
          return false
        }

        var first = files[0]
        console.log(first)

        if (!first.type.startsWith("image")) {
          alert(`You can only drag & drop image, this file is a ${first.type}`)
          return false
        }

        if (first.size >= 5000000) {
          alert(`File too large: ${Math.floor(first.size / 1048576, 2)}mb when max size is 5mb`)
          return false
        }

        ssb
          .addBlob(first)
          .then(hash => {
            image = hash
          })
          .catch(err => {
            alert("Couldn't attach file: " + err)
          })
      } catch (n) {
        console.error("error, attaching", n)
      }
    }

    const attachFile = ev => {
      const files = ev.target.files
      readFileAndAttach(files)
    }

    return m(".flex", [
      m(".flex-1", [
        m(".container", m("img", { src: patchfox.httpUrl("/blobs/get/" + image), alt: feed })),
        m("input.btn.btn-link.text-center", {
          type: "file",
          oninput: attachFile,
          id: "fileInput",
        }),
      ]),
      m(".flex-1", [
        m("div", { class: "bg-accent text-accent-content p-2 rounded mb-4" }, m("span", "📝 Editing Your Profile 📝")),
        m(
          Form,
          {
            onSave: save,
            onCancel: cancel,
            submitting: vnode.state.submitting,
          },
          [
            m(TextInput, {
              label: "Name",
              id: "name",
              value: name,
            }),
            m(TextArea, { id: "description", value: description }),
          ]
        ),
      ]),
    ])
  },
}

module.exports = ProfileEditor
