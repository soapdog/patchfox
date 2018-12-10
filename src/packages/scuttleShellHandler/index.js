import ScuttleShellHandler from "./scuttleShellHandler"

var pkg = {
  name: "Scuttle Shell Handler",
  description: "A Core Package responsible for handling Scuttle Shell.",
  routes: [
    { route: "/start-scuttle-shell", view: ScuttleShellHandler }
  ],
}

export default pkg;