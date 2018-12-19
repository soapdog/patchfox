import m from "mithril";
import Model from "./model";

var SetupForm = {
  oninit: Model.load,
  selectedSecretFile: ev => {
    var secretFile = ev.target.files[0];
    var reader = new FileReader();
    reader.onload = function (evt) {
      console.log(evt.target.result);
      var contents = evt.target.result;
      var secret = contents.split("\n").filter(function (line) {
        return line.indexOf('#') != 0;
      });
      secret = JSON.parse(secret.join("\n"));
      console.log("secret", secret);
      Model.config.keys = secret;
      Model.config.remote = `ws://localhost:8989~shs:${secret.id.slice(0, secret.id.indexOf("=") + 1)}`;
      m.redraw();
    };
    reader.readAsText(secretFile);


  },
  view: function (vnode) {
    return m("form#setup", {
      onsubmit: function (e) {
        e.preventDefault();
        Model.save();
        m.route.set("/setup-test");
      }
    }, [
        m("label[for=remote]", "Remote:"),
        m("input[type=text][placeholder=Your WS remote][name=remote]", {
          oninput: m.withAttr("value", function (value) { Model.config.remote = value }),
          value: Model.config.remote
        }),
        m("label[for=secret]", "Secret:"),
        m("textarea[name=secret]", {
          oninput: m.withAttr("value", function (value) { Model.config.keys = JSON.parse(value) }),
          value: JSON.stringify(Model.config.keys)
        }),
        m("p", ["Select secret file: ", m("input[type=file]", { onchange: this.selectedSecretFile }, "Browse secret")]),
        m("p", [
          m("input[type=checkbox][name=shellflag]", {
            oninput: m.withAttr("value", function (value) { Model.config.flagShellStart = value }),
            value: Model.config.flagShellStart
          }),
          m("label[for=shellflag]", "Start Scuttle-Shell when Firefox launches")
        ]),
        m("div", [
          m("button[type=submit]", "Save")
        ]),
        m("h3", "Advanced"),
        m("p", m.trust("<i>Change the items below only if you know what you are doing.</i>")),
        m("p", ["Select manifest file: ", m("input[type=file]", {
          oninput: m.withAttr("value", function (value) { Model.config.manifest = JSON.parse(value) }),
          value: JSON.stringify(Model.config.manifest)
        })
        ]),


        m("p", m("a", {
          href: '/setup-test',
          oncreate: m.route.link
        }, "Run configuration test on saved configuration"))
      ]);
  }
}

export default SetupForm;