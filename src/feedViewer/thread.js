import m from "mithril";
import stream from "mithril/stream";
import pull from "pull-stream";
import timeago from "timeago.js";
import common from "../common";
import Post from "../common/cards/post";

var thread = stream([]);

const Thread = {
  oninit: (vnode) => {
    thread([])
    const msgID = m.route.param("msgID");
    if (sbot) {
      console.log("Trying to load thread", msgID);
      if (msgID) {
        pull(
          sbot.threads.thread({
            root: msgID
          }),
          pull.drain(t => {
            // thread is an object { messages, full } where `messages` is an
            // array of SSB messages, and full is a boolean indicating whether
            // `messages` array contains all of the possible messages in the
            // thread
            var ts = thread();
            ts.push(t);
            thread(ts);
            m.redraw();
          })
        );
      }
    }
  },
  threadView: () => {
    const threads = thread();
    return threads.map(t => {
      if (t.hasOwnProperty("messages")) {
        let full_thread_key = encodeURIComponent(t.messages[0].key);
        return m("div.thread", [
          t.messages.map(message => m(Post, { message })),
          t.full !== true ? m("div.full-thread-banner", m(`a[href=ssb:${t.messages[0].key}]`, "View full thread")) : ""
        ]);
      }
    });
  },
  missingSbot: () => {
    return m("p", "no sbot");
  },
  view: function (vnode) {
    const msgID = m.route.param("msgID");
    return m("div.feed", [
      m("h1", [
        m("span", "Thread:"),
        m(`a[href=ssb:${msgID}]`, msgID)
      ]),
      sbot !== false ? this.threadView(vnode) : this.missingSbot(vnode)
    ]);
  }
}

export default Thread;