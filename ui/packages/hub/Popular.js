const m = require("mithril")
const MessageRenderer = require("../../core/components/MessageRenderer.js")
const Spinner = require("../../core/components/Spinner.js")

const PopularView = {
  oninit: (vnode) => {
    vnode.state.msgs = []
    vnode.state.shouldLoadMessages = true
    vnode.state.period = vnode.attrs.period || "week"
    vnode.state.page = vnode.attrs.page || 1
    
  },
  view: (vnode) => {
    let limit = vnode.attrs.limit || false

    if (vnode.state.shouldLoadMessages) {
      if (vnode.state.page) {
        patchfox.title(`Page: ${vnode.state.page}`)
      }

      console.time("popular")
      ssb
        .popular({ period: vnode.state.period, page: vnode.state.page })
        .then((ms) => {
          console.timeEnd("popular")
          console.log(`popular for ${vnode.state.period} msgs`, ms)
          vnode.state.msgs = ms
          window.scrollTo(0, 0)
          vnode.state.shouldLoadMessages = false
          m.redraw()
        })
        .catch((n) => {
          patchfox.go("errorHandler", "view", { error: n })
        })
    }

    const goNext = () => {
      vnode.state.msgs = []
      vnode.state.shouldLoadMessages = true
      vnode.state.page +=1
      m.redraw()
    }

    const goPrevious = () => {
      vnode.state.msgs = []
      vnode.state.shouldLoadMessages = true
      vnode.state.page -=1
      m.redraw()
    }

    const pagination = [
      m("br"),
      m(".btn-group", [
        m(
          "button.btn.btn-outline.btn-wide",
          { onclick: goPrevious },
          "Previous"
        ),
        m("button.btn.btn-outline.btn-wide", { onclick: goNext }, "Next"),
      ]),
    ]

    const PeriodButton = (periodValue, periodLabel) =>
      m("input", {
        "type": "radio",
        "name": "period",
        "value": periodValue,
        "data-title": periodLabel,
        onclick: () => {
          vnode.state.msgs = []
          vnode.state.shouldLoadMessages = true
          vnode.state.period = periodValue
        },
        "class":
          vnode.state.period == periodValue
            ? "btn btn-outline btn-xs btn-active"
            : "btn btn-outline btn-xs",
      }, periodLabel)

    return [
      m(".container", [
        m(".btn-group", [
          PeriodButton("day", "Day"),
          PeriodButton("week", "Week"),
          PeriodButton("month", "Month"),
          PeriodButton("year", "Year"),
        ]),
      ]),
      vnode.state.shouldLoadMessages
        ? m(Spinner)
        : vnode.state.msgs.map((msg) => m(MessageRenderer, { msg })),
      pagination,
    ]
  },
}

module.exports = PopularView
