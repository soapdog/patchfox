import m from "mithril";
import avatar from "ssb-avatar";
import ScuttleShellHandler from "./scuttleShellHandler";
import md from "../markdown";
import ref from "ssb-ref";


const pkg = {
  name: "Common Tools",
  description: "A Core Package that provides common tools for other packages.",
  routes: [
    { route: "/start-scuttle-shell", view: ScuttleShellHandler }
  ],
  avatarAux: (id) => {
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
  },
  mdown: (text) => {
    console.log(text)
    let html = md.block(text, {
      imageLink: (i) => {
        console.log("imageLink", i);
        return `http://localhost:8989/blobs/get/${i}`;
      },
      urlWithBlob: (i) => {
        console.log("urlWithBlob", i);
        return `http://localhost:8989/blobs/get/${i}`;
      },
      urlWithSigil: (i) => {
        console.log("urlWithSigil", i);
        return i;
      },
      urlWithMention: (i) => {
        console.log("urlWithMention", i);
        return i;
      },
      toUrl: (i) => {
        console.log("tourl", i);
        if (ref.isBlob(i)) {
          return `http://localhost:8989/blobs/get/${i}`;
        } else {
          return `ssb:${i}`;
        }
      }
    })
    console.log(html)
    return m.trust(html);
  },
  avatar: (id) => {
    pkg.avatarAux(id).then((user) => {
      // console.log("user", user)
      // return m("div.avatar", [
      //   m("span", user.name)
      // ]);
      // m.redraw();
    })

    if (localStorage.key(id)) {
      let user = JSON.parse(localStorage.getItem(id)) || { name: id, id: id, image: "" };
      // console.log("user from storage", user)
      return m("div.avatar", [
        m("img.avatar", { src: `http://localhost:8989/blobs/get/${user.image}` }),
        m("span", user.name)
      ]);
    } else {
      return m("div.avatar", id)
    }
  },
}

export default pkg;