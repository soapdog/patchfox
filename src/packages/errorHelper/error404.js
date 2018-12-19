import m from "mithril";

var Error404 = {
  view: function (vnode) {
    var route = m.route.get();
    return m("h1", `Not Implemented: ${route}`);
  }
}

export default Error404;