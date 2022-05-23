const m = require("mithril")
const MessageRenderer = require("../../core/components/MessageRenderer.js")

const PopularView = {
  oninit: (vnode) => {
    vnode.state.msgs = []
    vnode.state.shouldLoadMessages = true
  },
  view: (vnode) => {
    let period = vnode.attrs.period || "week"
    let page = vnode.attrs.page || 1
    let limit = vnode.attrs.limit || false

    if (vnode.state.shouldLoadMessages) {
      if (page) {
        patchfox.title(`Page: ${page}`)
      }

      console.time("popular")
      ssb
        .popular({ period, page })
        .then((ms) => {
          console.timeEnd("popular")
          console.log(`popular for ${period} msgs`, ms)
          vnode.state.msgs = ms
          window.scrollTo(0, 0)
          vnode.state.shouldLoadMessages = false
        })
        .catch((n) => {
          patchfox.go("errorHandler", "view", { error: n })
        })
    }

    const goNext = () => {
      let lt = vnode.state.msgs[vnode.state.msgs.length - 1].value.timestamp
      vnode.state.msgs = []
      patchfox.go("hub", "popular", { page: page + 1, period })
    }

    const urlForNext = () => {
      let lt = vnode.state.msgs[vnode.state.msgs.length - 1].value.timestamp
      return patchfox.url("hub", "popular", { page: page + 1, period })
    }

    const goPrevious = () => {
      vnode.state.msgs = []
      history.back()
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
        "classes":
          period == periodValue
            ? "btn btn-outline btn-xs btn-active"
            : "btn btn-outline btn-xs",
      })

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
        : vnode.state.msgs.map((msgs) => m(MessageRenderer, { msg })),
      pagination,
    ]
  },
}

module.exports = PopularView
