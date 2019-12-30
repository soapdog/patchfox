const m = require("mithril")
const prettyPrintJson = require("pretty-print-json");

class JoinPub {

    view() {

        let sbot = ssb.sbot;

        let joining = false;
        let invite = "";
        let error = false;
        let msg = "";

        const joinPub = (ev) => {
            ev.preventDefault()
            error = false;
            msg = "";
            joining = true;
            sbot.invite.accept(invite, (err, result) => {
                joining = false;
                if (err) {
                    error = true;
                    msg = prettyPrintJson.toHtml(err);
                } else {
                    msg = prettyPrintJson.toHtml(result);
                }
                m.redraw()
            });
        };

        return [
            m("h1.title", "Join Pub"),
            m("form", { onsubmit: joinPub }, [
                m(".form-group", [
                    m("label.form-label[for=invite-code]", "Invite Code"),
                    m("input.form-input[type=text]", {
                        placeholder: "Invite Code",
                        onchange: (ev) => invite = ev.target.value
                    }),
                    m("button.btn.btn-primary", {
                        class: joining ? "loading" : "",
                        disabled: joining,
                        onclick: joinPub
                    }, "Join Pub")
                ])
            ]),
            msg.length > 0 ? m(".container", m(".toast", { class: error ? "toast-error" : "" },
                m("pre", m.trust(msg)))) : ""
        ]
    }
}

module.exports = JoinPub