import Public from "./public";
import Thread from "./thread";

var pkg = {
  name: "Feed Viewer",
  description: "A Core Package responsible for feed vieweing.",
  routes: [
    { route: "/public", view: Public },
    { route: "/thread/:msgID", view: Thread }
  ],
}

export default pkg;