/**
 * COMPONENT "Timestamp"
 * 
 * OBJECTIVE:
 * A small viewer for the Timestamp of a message.
 * 
 * This is a Mithril component.
 */

export default class Timestamp {

    view(vnode) {
        let timestamp = vnode.attrs.timestamp
        let date = new Date(timestamp)
        let dateFormatOptions = {
            weekday: "short",
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        };
        let dateFormatted = new Intl.DateTimeFormat("en-US", dateFormatOptions).format(date)
        return m("span.label.label-rounded.float-right", dateFormatted)
    }
}
