import Error404 from "./error404"

var pkg = {
  name: "Error Helper",
  description: "A Core Package responsible for 404 errors.",
  routes: [
    { route: "/:404...", view: Error404 }
  ],
}

export default pkg;