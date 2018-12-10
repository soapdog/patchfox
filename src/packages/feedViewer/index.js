import Public from "./public"

var pkg = {
  name: "Feed Viewer",
  description: "A Core Package responsible for feed vieweing.",
  routes: [
    { route: "/public", view: Public }
  ],
}

export default pkg;