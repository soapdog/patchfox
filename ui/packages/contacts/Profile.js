const m = require("mithril")
const ssbUri = require("ssb-uri2")
const pull = require("pull-stream")

const Posts = require("./Posts.js")
const Following = require("./Following.js")
const Followers = require("./Followers.js")
const Friends = require("./Friends.js")
const Editor = require("./ProfileEditor.js")
const MoreInfo = require("./MoreInfo.js")

const Spinner = require("../../core/components/Spinner.js")
const { when } = require("../../core/kernel/utils.js")

const ProfileView = {
  oninit: vnode => {
    let feed = vnode.attrs.feed || ssb.feed
    vnode.state.name = feed
    vnode.state.blocking = false
    vnode.state.following = false
    vnode.state.showEditor = false
    vnode.state.loadingAvatar = true
    vnode.state.loadingAbout = true
    vnode.state.loadingAliases = true
    vnode.state.currentSubView = vnode.attrs.currentSubView || "posts"
    vnode.state.aliases = []

    ssb.avatar(feed).then(data => {
      vnode.state.name = data.name
      vnode.state.image = data.image
      vnode.state.loadingAvatar = false
      patchfox.title(name)
    })

    ssb.profile(feed).then(data => {
      vnode.state.lastAbout = data.about.reverse().find(m => {
        let a = m.value.content
        return a.hasOwnProperty("description")
      })
      console.log(vnode.state.lastAbout)
      try {
        vnode.state.description = vnode.state.lastAbout.value.content.description
      } catch (n) {
        vnode.state.description = ""
      }
      console.log(vnode.state.description)

      window.scrollTo(0, 0)
      vnode.state.loadingAbout = false
    })

    if (feed !== ssb.feed) {
      ssb.following(feed).then(f => {
        vnode.state.following = f
        m.redraw()
      })
      ssb.blocking(feed).then(f => {
        vnode.state.blocking = f
        m.redraw()
      })
    }

    ssb.rooms2
      .getAliases(feed)
      .then(data => {
        vnode.state.aliases = data
        vnode.state.loadingAliases = false
        m.redraw()
      })
      .catch(err => console.error(err))
  },
  view: vnode => {
    let feed = vnode.attrs.feed || ssb.feed

    let profile = vnode.state.profile
    let description = vnode.state.description
    let following = vnode.state.following
    let blocking = vnode.state.blocking
    let image = vnode.state.image
    let lastAbout = vnode.state.lastAbout
    let name = vnode.state.name
    let followersCount = false
    let followingCount = false
    let friendsCount = false
    let showEditor = vnode.state.showEditor

    let subViews = {
      posts: Posts,
      following: Following,
      followers: Followers,
      friends: Friends,
      moreInfo: MoreInfo,
    }

    patchfox.title(feed)

    const blockingChanged = ev => {
      let v = ev.target.checked
      if (v) {
        ssb.block(feed).catch(() => {
          vnode.state.blocking = false
          m.redraw()
        })
      } else {
        ssb.unblock(feed).catch(() => {
          vnode.state.blocking = true
          m.redraw()
        })
      }
    }

    const followingChanged = ev => {
      let v = ev.target.checked
      if (v) {
        ssb.follow(feed).then(() => {
          vnode.state.following = true
          m.redraw()
        }).catch(() => {
          vnode.state.following = false
          m.redraw()
        })
      } else {
        ssb.unfollow(feed).then(() => {
          vnode.state.following = false
          m.redraw()
        }).catch(() => {
          vnode.state.following = true
          m.redraw()
        })
      }
    }

    const countCallback = ev => {
      let { followers, following, friends } = ev

      if (followers) {
        vnode.state.followersCount = followers
      }

      if (following) {
        vnode.state.followingCount = following
      }

      if (friends) {
        vnode.state.friendsCount = friends
      }

      m.redraw()
    }

    const toggleEditor = () => {
      vnode.state.showEditor = !vnode.state.showEditor
    }

    if (vnode.state.loadingAvatar || vnode.state.loadingAbout) {
      return m(".p-4", [m(Spinner)])
    }

    if (vnode.state.showEditor) {
      return m(
        ".p-4",
        m(Editor, {
          feed,
          name,
          description,
          image,
          onCancelEdit: () => (vnode.state.showEditor = false),
          onSaveProfile: () => {
            location.reload()
          },
        })
      )
    }

    const makeTab = (viewId, label) => {
      return m(
        "li.tab",
        {
          class: vnode.state.currentSubView === viewId ? "tab-active" : "",
        },
        m(
          "a",
          {
            href: "",
            onclick: ev => {
              ev.preventDefault()
              vnode.state.currentSubView = viewId
            },
          },
          label
        )
      )
    }

    return m(".p-4", [
      m(
        ".flex",
        m(
          ".flex-1",
          m(
            ".container.pr-4",
            m("img.rounded-xl.object-contain.md:object-scale-down", {
              src: patchfox.httpUrl("/blobs/get/" + image),
              alt: feed,
            })
          )
        ),
        m(".flex-1", [
          when(
            feed == ssb.feed,
            m(".bg-accent.text-accent-content.p-2.mb-4.rounded", [
              m("span", "❤ Thats You ❤"),
              m(
                "span.cursor-pointer.float-right",
                {
                  onclick: toggleEditor,
                },
                [m("i.fas.fa-edit"), "Edit your profile"]
              ),
            ])
          ),
          m("h1.uppercase.font-medium.text-md.mt-4", vnode.state.name),
          m(
            "a",
            {
              href: ssbUri.fromFeedSigil(feed),
            },
            m("span.text-sm.font-extralight", feed)
          ),
          when(
            feed !== ssb.feed,
            m(".container.mt-2", [
              m(".divider"),
              m(
                ".form-control",
                m("label.cursor-pointer.label", [
                  m("span.label-text", "following"),
                  m("input.toggle", {
                    type: "checkbox",
                    onchange: followingChanged,
                    checked: following,
                  }),
                ])
              ),
              m(
                ".form-control",
                m("label.cursor-pointer.label", [
                  m("span.label-text", "blocking"),
                  m("input.toggle", {
                    type: "checkbox",
                    onchange: blockingChanged,
                    checked: blocking,
                  }),
                ])
              ),
              m(".divider"),
            ])
          ),
          vnode.state.loadingAbout ? m(Spinner) : m(".prose.mt-4.mb-4", m.trust(ssb.markdown(vnode.state.description))),
          m(
            ".extra-actions",
            m(
              "a.btn.btn-sm",
              {
                href: patchfox.url("post", "compose", { replyfeed: feed }),
              },
              `New post mentioning ${vnode.state.name}`
            )
          ),
          m(".extra-actions", [
            when(vnode.state.loadingAliases, m(Spinner)),
            when(!vnode.state.loadingAliases && vnode.state.aliases.length == 0, m("p", "No aliases set for this profile.")),
            when(
              !vnode.state.loadingAliases && vnode.state.aliases.length > 0,
              m(
                "ul",
                vnode.state.aliases.map(alias =>
                  m(
                    "li",
                    m(
                      "a.btn.btn-link",
                      {
                        href: alias.url,
                        target: "_blank",
                      },
                      alias.url
                    )
                  )
                )
              )
            ),
          ]),
        ])
      ),
      m("br"),
      m("ul.tabs.tabs-boxed.mb-4", [makeTab("posts", "Posts"), makeTab("friends", "Friends"), makeTab("following", "Following"), makeTab("followers", "Followers"), makeTab("moreInfo", "More Info")]),
      m("br"),
      m(subViews[vnode.state.currentSubView], {
        feed,
        oncount: countCallback,
      }),
    ])
  },
}

module.exports = ProfileView
