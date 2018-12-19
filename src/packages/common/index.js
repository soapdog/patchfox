import mithril from "mithril";
import avatar from "ssb-avatar";
import ScuttleShellHandler from "./scuttleShellHandler";


const pkg = {
  name: "Common Tools",
  description: "A Core Package that provides common tools for other packages.",
  routes: [
    { route: "/start-scuttle-shell", view: ScuttleShellHandler }
  ],
  avatar: (id) => {
    return new Promise((resolve, reject) => {
      if (!window.sbot) {
        reject(id);
      }

      let s = window.sbot
      avatar(s, s.id, id, (err, data) => {
        if (data) {
          localStorage.setItem(id, JSON.stringify(data));
          resolve(data);
        } else {
          reject(id);
        }
      })
    })
  }
}

export default pkg;