import m from "mithril";
import stream from "mithril/stream";
import pull from "pull-stream";
import timeago from "timeago.js";
import common from "../index";

var postCard = {
  view: vnode => {
    const timeagoInstance = timeago();
    let message = vnode.attrs.message;
    return m("div.message", [
      m("div.message-header", [
        m("div.message-author", common.avatar(message.value.author)),
        m("div.space", ""),
        m("div.message-date", timeagoInstance.format(message.value.timestamp))
      ]),
      m("div.message-body", common.mdown(message.value.content.text)),
      m("div.message-footer", [
        m(`a[href=ssb:${message.key}]`, "Permalink")
      ])
    ]);
  }
}

export default postCard;