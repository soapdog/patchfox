const m = require("mithril")
const Spinner = require("../../core/components/Spinner.js")
const MoreInfoField = require("./MoreInfoField.js")
const pull = require("pull-stream")
const _ = require("lodash")
const { when } = require("../../core/kernel/utils.js")


const MoreInfoView = {
  oninit: (vnode) => {
    let feed = vnode.attrs.feed

    vnode.state.currentFields = []
    vnode.state.saving = false
    vnode.state.dirty = false
    vnode.state.error = false
    vnode.state.msg = false
    vnode.state.loading = true

    let filter = {
      value: {
        author: ssb.feed,
        content: {
          type: "more-info",
          about: feed,
        },
      },
    }

    if (ssb.platform === "nodejs-db1") {
      pull(
        ssb.sbot.query.read({
          query: [
            {
              $filter: filter,
            },
          ],
          reverse: true,
          limit: 1,
        }),
        pull.collect((err, data) => {
          vnode.state.loading = false
          if (err) {
            console.error("more-info", err)
            vnode.state.error = err
          } else {
            console.log("more-info", data)
            let fields = _.get(data[0], "value.content.fields", [])
            if (fields.length > 0) {
              vnode.state.currentFields = fields
            }
          }
          m.redraw()
        })
      )
    }
  },

  view: (vnode) => {
    let feed = vnode.attrs.feed
    let fieldTypes = ["URL", "email", "phone", "text"]

    let newFieldName = ""
    let newFieldType = fieldTypes[0]
    let newFieldValue = ""

    const addNewField = () => {
      vnode.state.dirty = true
      let newField = {
        name: newFieldName,
        type: newFieldType,
        value: newFieldValue,
      }

      vnode.state.currentFields.push(newField)
    }

    const save = (ev) => {
      ev.stopPropagation()
      ev.preventDefault()
      vnode.state.saving = true
      m.redraw()

      // lucky numbers are 5 random cryptographically safe integers that
      // are added to each more info message. They are there just to make it
      // harder to brute-force decryption by assuming the structure and values
      // inside the message.
      let luckyNumbers = new Uint32Array(5)
      window.crypto.getRandomValues(luckyNumbers)

      let data = {
        type: "more-info",
        about: feed,
        fields: vnode.state.currentFields,
        luckyNumbers,
        recps: [ssb.feed],
      }

      console.log("about to post", data)
      ssb
        .publish(data)
        .then((msg) => {
          console.log("more-info", msg)
          vnode.state.saving = false
          vnode.state.error = false
          vnode.state.dirty = false
          vnode.state.msg = msg
          m.redraw()
        })
        .catch((n) => {
          console.error("Couldn't post", n)
          vnode.state.saving = false
          vnode.state.error = n.toString()
          m.redraw()
        })
    }

    const deleteField = (ev) => {
      console.log("delete", ev)
      let index = new Number(ev.detail.index)
      if (!isNaN(index)) {
        vnode.state.currentFields.splice(index, 1)
        vnode.state.dirty = true
        m.redraw()
      }
    }

    const errorDisplay = m(
      ".alert.alert-error",
      `An error happening when saving the new information: ${vnode.state.error.message}`
    )

    const successDisplay = m(".alert.alert-success", "Information Saved")

    const warningDisplay = m(
      ".alert.alert-warning",
      m.trust(
        "Your edits are not saved. Remember to press the <em>Save</em> button to save them."
      )
    )

    return m("div", [
      when(vnode.state.error, errorDisplay),
      when(vnode.state.msg && !vnode.state.dirty, successDisplay),
      when(vnode.state.dirty, warningDisplay),

      m(".current-fields", [
        when(vnode.state.loading, m(Spinner)),
        when(!vnode.state.loading, [
          m("button.float-right.btn.btn-link", "Export To vCard"),
          m(
            "table.table.w-full.table-zebra",
            m(
              "tbody",
              vnode.state.currentFields.map((field, index) => {
                return m(MoreInfoField, {
                  field,
                  index,
                  ondelete: deleteField,
                })
              })
            )
          ),
          when(
            vnode.state.dirty,
            m(
              "button.btn.mt-2",
              {
                class: vnode.state.saving ? "loading" : "",
                onclick: save,
              },
              "Save"
            )
          ),
        ]),
      ]),

      m(".more-fields", [
        m(
          "h2.uppercase.font-medium.text-md.mb-2.mt-4.border-t-2",
          "Add New Field"
        ),
        m(
          "form",
          {
            onsubmit: addNewField,
          },
          [
            m(".form-control", [
              m(
                "label.label",
                {
                  for: "field-name",
                },
                m("span.label-text", "Name")
              ),
              m("input.input-bordered.w-full.max-w-xs", {
                type: "text",
                id: "field-name",
                onchange: (ev) => (newFieldName = ev.target.value),
                placeholder: "Field Name",
              }),
            ]),
            m(".form-control", [
              m(
                "label.label",
                {
                  for: "field-type",
                },
                m("span.label-text", "Type")
              ),
              m(
                "select.select.select-bordered.w-full.max-w-xs",
                {
                  onchange: (ev) => (newFieldType = ev.target.value),
                },
                fieldTypes.map((f) => m("option", { value: f }, f))
              ),
            ]),
            m(".form-control", [
              m(
                "label.label",
                {
                  for: "field-value",
                },
                m("span.label-text", "Value")
              ),
              m("input.input-bordered.w-full.max-w-xs", {
                type: "text",
                id: "field-value",
                onchange: (ev) => (newFieldValue = ev.target.value),
                placeholder: "Field Value",
              }),
            ]),
            m("input.btn.btn-primary.mt-2", {
              type: "submit",
              id: "save-field-button",
              class: vnode.state.saving ? "loading" : "",
              disabled: vnode.state.saving,
              value: "Add",
            }),
          ]
        ),
      ]),
    ])
  },
}

module.exports = MoreInfoView
