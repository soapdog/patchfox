import m from "mithril";
import stream from "mithril/stream";
import pull from "pull-stream";
import md from "ssb-markdown";
import timeago from "timeago.js";
import common from "../common";

var thread = stream([]);

const Thread = {
  mdown: (text) => {
    return m.trust(md.block(text, {
      imageLink: (i) => `http://localhost:8989/blobs/get/${i}`,
      toUrl: (i) => {
        console.log(i)
        return `http://localhost:8989/blobs/get/${i}`
      }
    }));
  },
  avatar: (id) => {
    common.avatar(id).then((user) => {
      // console.log("user", user)
      return m("div.avatar", [
        m("span", user.name)
      ]);
      m.redraw();
    })

    if (localStorage.key(id)) {
      let user = JSON.parse(localStorage.getItem(id)) || { name: id, id: id, image: "" };
      // console.log("user from storage", user)
      return m("div.avatar", [
        m("img.avatar", { src: `http://localhost:8989/blobs/get/${user.image}` }),
        m("span", user.name)
      ]);;
    } else {
      return m("div.avatar", id)
    }
  },
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
    console.log(thread());
    const timeagoInstance = timeago();
    const threads = thread();
    return threads.map(t => {
      if (t.hasOwnProperty("messages")) {
        return m("div.thread", [
          t.messages.map(message => {
            return m("div.message", [
              m("div.message-header", [
                m("div.message-author", Thread.avatar(message.value.author)),
                m("div.space", ""),
                m("div.message-date", timeagoInstance.format(message.value.timestamp))
              ]),
              m("div.message-body", Thread.mdown(message.value.content.text)),
              m("div.message-footer", [
                m(`a[href=ssb:${message.key}]`, "Permalink")
              ])
            ]);
          }),
          t.full !== true ? m("div.full-thread-banner", m("a", {
            href: `/thread/${t.messages[0].key}`,
            oncreate: m.route.link
          }, "View full thread")) : ""
        ]);
      }
    });
  },
  missingSbot: () => {
    return m("p", "no sbot");
  },
  view: function (vnode) {
    const msgID = m.route.param("msgID");
    console.log("from view", msgID);
    return m("div.feed", [
      m("h1", [
        m("span", "Thread:"),
        m(`a[href=ssb:${msgID}`, msgID)
      ]),
      sbot !== false ? this.threadView(vnode) : this.missingSbot(vnode)
    ]);
  }
}

export default Thread;