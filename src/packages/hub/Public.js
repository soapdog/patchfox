  const m = require("mithril")
  const MessageRenderer = require("../../core/components/MessageRenderer.js");

  require("./public.css")

  class Public {

      constructor(vnode) {
          this.msgs = [];
          this.error = false;

          this.lt = vnode.attrs.lt || false;

          document.title = `Patchfox - Public`;

          let opts = {};
          if (this.lt) {
              opts.lt = Number(this.lt);
              document.title = `Patchfox - Public - ${this.lt}`;
          }

          console.time("public");
          ssb
              .public(opts)
              .then(ms => {
                  console.timeEnd("public");
                  console.log("got msgs", ms);
                  this.msgs = ms;
                  window.scrollTo(0, 0);
                  m.redraw()
              })
              .catch(n => {
                  throw n;
              });
      }

      goNext(ev) {
          ev.preventDefault()
          let lt = this.msgs[this.msgs.length - 1].value.timestamp;
          this.msgs = false;
          patchfox.go("hub", "public", { lt });
      };

      urlForNext() {
          let lt = this.msgs[this.msgs.length - 1].value.timestamp;
          return patchfox.url("hub", "public", { lt });
      };

      goPrevious(ev) {
          ev.preventDefault()
          this.msgs = false;
          history.back();
      };

      view(vnode) {

          let top = m(".container", m(".columns", m("h4.column", "Public Feed")))
          let error = this.error ? m(".toast.toast-error", `Error: ${this.error}`) : ""
          let loading = m(".loading.loading-lg")
          let messages = []

          if (this.msgs.length > 0) {
              messages = this.msgs.map(msg => m(MessageRenderer, { msg }))
          }

          let pagination = m("ul.pagination", [
              m("li.page-item.page-previous", m("a", {
                  href: "#/public",
                  onclick: this.goPrevious
              }, m(".page-item-subtitle", "Previous"))),
              m("li.page-item.page-next", m("a", {
                  href: "#/public",
                  onclick: this.goNext
              }, m(".page-item-subtitle", "next")))
          ])

          return [
              top,
              error,
              this.msgs.length == 0 ? loading : [messages, pagination]
          ]
      }

  }

  module.exports = Public