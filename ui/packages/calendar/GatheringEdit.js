const m = require("mithril")
const Scuttle = require("scuttle-gathering")
const Form = require("../../core/components/daisyui/Form.js")
const TextInput = require("../../core/components/daisyui/TextInput.js")
const TextArea = require("../../core/components/daisyui/TextArea.js")



const gathering = Scuttle(ssb.sbot)
const sbot = ssb.sbot

const GatheringEdit = {
  oninit: vnode => {
    vnode.state.gatheringId = vnode.attrs.gatheringId || false
  },
  view: vnode => {
    let gatheringId = vnode.state.gatheringId

    let title = vnode.state.title
    let startDateTime = vnode.state.startDateTime
    let description = vnode.state.description
    let location = vnode.state.location
    let image = vnode.state.image

    const createOrUpdateGathering = () => {
      let opts = {
        title,
        startDateTime,
        description,
        location,
        image,
      }

      const cb = (err, data) => {
        if (err) {
          // vnode.state.error = err
          throw err
        } else {
          // vnode.state.data = data
          if (data.key) {
            patchfox.go("calendar", "view", {msgid: data.key})
          }
        }
      }

      if (gatheringId) {
        gathering.put(gatheringId, opts, cb)
      } else {
        gathering.post(opts, cb)
      }
    }

    const setField = field => {
      const eventHandler = ev => {
        vnode.state[field] = ev.target.value
      }
      return eventHandler
    }

    const makeInput = field => {
      return m(TextInput, {
        label: field,
        onchange: setField(field),
        value: vnode.state[field]
      })
    }

    return m(Form, {
      onSave: createOrUpdateGathering
    }, [
      makeInput("title"),
      makeInput("startDateTime"),
      makeInput("location"),
    ])

  }
}

module.exports = GatheringEdit
