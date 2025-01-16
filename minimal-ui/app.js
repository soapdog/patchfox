const root = document.body

let server = "http://localhost:3000/jsonrpc"
let token = "85b2ae37-0be4-4faa-b1f0-d02189a31cfa" // replace with your token.
let identity = "@fu9wRz7+UwjDcvW6TZrvbNDT0cEPgWBh/ZZq5dKGEyY=.ed25519"

function md(content) {
  let opts = {
    html: true,
    linkify: true,
    typographer: true
  }
  let markdown = window.markdownit(opts)
  let result = markdown.render(content)
  
  function replaceMsgID(match, id, offset, string) {
    let eid = encodeURIComponent(`%${id}`);
  
    return `<a class="thread-link" href="#!/thread/${eid}`;
  }
  
  function replaceChannel(match, id, offset, string) {
    let eid = encodeURIComponent(id);
  
    return `<a class="channel-link" href="#!/channel/${eid}`;
  }
  
  function replaceFeedID(match, id, offset, string) {
    let eid = encodeURIComponent(`@${id}`);
    return (
      '<a class="profile-link" href="#!/profile/' + eid
    );
  }
  
  function replaceImageLinks(match, id, offset, string) {
    return (
      `<a class="image-link" target="_blank" href="http://127.0.0.1:8989/blobs/get/` + encodeURIComponent(id) + `"`
    );
  }
  
  function replaceImages(match, id, offset, string) {
    return (
      `<img class="is-image-from-blob" src="http://127.0.0.1:8989/blobs/get/&` + (id) + `" `
    );
  }
  
  function replaceVideos(match, id, offset, string) {
    return (
      `<video controls class="is-video-from-blob" src="http://127.0.0.1:8989/blobs/get/&` + encodeURIComponent(id) + `"`
    );
  }
  
  function replaceAudios(match, id, offset, string) {
    return (
      `<audio controls class="is-audio-from-blob" src="http://127.0.0.1:8989/blobs/get/&` + encodeURIComponent(id)+ `"`
    );
  }
  
  result = result
  .replace(/<pre>/gi, '<pre class="code">')
  .replace(/<a href="#([^"]*)/gi, replaceChannel)
  .replace(/<a href="@([^"]*)/gi, replaceFeedID)
  .replace(/target="_blank"/gi, "")
  .replace(/<a href="%([^"]*)/gi, replaceMsgID)
  .replace(/<img src="&([^"]*)/gi, replaceImages)
  .replace(/<video controls src="&([^"]*)/gi, replaceVideos)
  .replace(/<audio controls src="&([^"]*)/gi, replaceAudios)
  .replace(/<a href="&([^"]*)/gi, replaceImageLinks);
  
  return result
}

async function callMethod(method, params) {
    const obj = {
        jsonrpc: "2.0",
        method: method,
        id: "1",
        params: [token, params],
    }

    const response = await fetch(server, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(obj), // body data type must match "Content-Type" header
    })
    return response.json() // parses JSON response into native JavaScript objects
}

const makeInput = ({ type = "text", id, label, value, events }) => {
    return m("label", { for: id }, [`${label}: `, m("input", { type, value, id, ...events })])
}

const header = {
    view: vnode => {
        return m("header", [
            m("h3", "Minimal Debugging UI"),
            m("section.tool-bar", [
                makeInput({
                    id: "server-address",
                    label: "RPC Server",
                    value: server,
                    events: {
                        oninput: e => {
                            server = e.target.value
                            console.log(server)
                        },
                    },
                }),
                makeInput({
                    id: "text",
                    value: token,
                    label: "Token",
                }),
                makeInput({
                    id: "identity",
                    label: "identity",
                    value: identity,
                    events: {
                        oninput: e => {
                            identity = e.target.value
                            console.log(identity)
                        },
                    },
                }),
                m("hr", {"aria-orientation": "vertical"}),
                m(m.route.Link, {selector: "a.<button>", href: "/new"}, "new post"),
                m(m.route.Link, {selector: "a.<button>", href: "/"}, "public"),
                m(m.route.Link, {selector: "a.<button>", href: "/private"}, "private"),
                m(m.route.Link, {selector: "a.<button>", href: "/mentions"}, "mentions"),
                m(m.route.Link, {selector: "a.<button>", href: "/profile"}, "profile"),
                m("hr", {"aria-orientation": "vertical"}),
                m(m.route.Link, {selector: "a.<button>", href: "/rpc"}, "raw RPC"),

            ]),
        ])
    },
}

const timeline = {
    fetchTimeline: vnode => {
        callMethod("ssb.timeline.public", { identity: "@fu9wRz7+UwjDcvW6TZrvbNDT0cEPgWBh/ZZq5dKGEyY=.ed25519" })
            .then(data => {
                console.dir(data)
                vnode.state.state = "loaded"
                vnode.state.messages = data.result
                m.redraw()
            })
            .catch(err => {
                console.log("error", err)
                vnode.state.state = "error"
                vnode.state.messages = []
                m.redraw()
            })
    },
    oninit: function(vnode) {
        vnode.state.messages = []
        vnode.state.state = "loading"
        this.fetchTimeline(vnode)
    },
    view: vnode => {
        let r
        switch (vnode.state.state) {
            case "loading":
                r = m(".box.plain", m("strong", "Loading messages..."))

            case "error":
                r = m(".box.bad", m("strong", `an error has happened, check the console`))
            case "loaded":
                r = [
                    vnode.state.messages.map(data => {
                      let msg = data.messages[0]
                      let content
                      
                      if (msg.text) {
                        content = m.trust(md(msg.text))
                      } else {
                        content = m("pre", m("code", JSON.stringify(msg,null, "  ")))
                      }
                        return m(".box.info", [m("strong.block.titlebar", `from: ${msg.author}`), content])
                    }),
                ]
        }
        return [m(header), m("main", r)]
    },
}

const rpc = {
    view: vnode => {
        let result = vnode.state.result ?? {}
        let content = vnode.state.content ?? {}
        let method = vnode.state.method ?? "ping"

        function callRPC() {
            callMethod(method, { identity, ...content })
            .then(data => {
                console.dir(data)
                vnode.state.state = "ok"
                vnode.state.result = data
                m.redraw()
            })
            .catch(err => {
                console.log("error", err)
                vnode.state.state = "error"
                vnode.state.result = err
                m.redraw()
            })
        }


        let ui = m("main", [
            m("form.table.rows", [
              m("p",[
                m("label", { 
                    for: "method" 
                },`method`),
                m("input", { 
                    type: "text", 
                    style: {width: "100%"}, 
                    value: method,
                    id: "method",
                    onchange: e => vnode.state.method = e.target.value
                })
                ]),
              m("p",[
                m("label", { 
                    for: "payload" 
                },"json payload"), 
                m("textarea", {
                  style: {width: "100%"}, 
                  rows: 10,
                  value: JSON.stringify(content,null," "),
                  id: "payload",
                  onchange: e => vnode.state.content = JSON.parse(e.target.value)
                })
              ]),
              m("p", m("button", {
                onclick: e => {
                  callRPC()
                }
              }, "Send request")),
            ]),
            m(".box.info", [
              m("strong.block.titlebar", `Result ${new Date()}`),
              m("code", m("pre", JSON.stringify(result,true," ")))
            ])
        ])

        return [m(header), ui]
    }
}

m.route(root, "/", {
    "/": timeline,
    "/rpc": rpc
})
