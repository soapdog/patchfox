<script>
  const QueryRepeater = require("../../core/components/parts/QueryRepeater.svelte");
  const AvatarChip = require("../../core/components/parts/AvatarChip.svelte");
  const pull = require("pull-stream");
  const Abortable = require("pull-abortable");
  const paramap = require("pull-paramap");
  const _ = require("lodash");
  const { onDestroy } = require("svelte");
  const { createEventDispatcher } = require("svelte");
  const dispatch = createEventDispatcher();

  const sbot = ssb.sbot;

  export let feed;

  let contacts = [];
  let loading = true;
  let abortable;

  const avatarClick = ev => {
    let feed = ev.detail.feed;
    let name = ev.detail.name;

    patchfox.go("contacts", "profile", { feed });
  };

  console.time("loading friends");

  onDestroy(() => abortable());

  pull(
    sbot.links({
      source: feed,
      rel: "contact",
      values: true,
      reverse: true
    }),
    (abortable = Abortable()),
    pull.map(function(msg) {
      return msg && msg.value && msg.value.content;
    }),
    pull.filter(function(content) {
      return content && content.type === "contact";
    }),
    pull.unique("contact"),
    pull.filter(function(content) {
      return content.following === true;
    }),
    paramap((content, cb) => {
      ssb.following(feed, content.contact)
        .then(data => {
          content.friend = data
          cb(null, content)
        })

    }),
    pull.filter(content => content.friend),
    pull.map("contact"),
    pull.collect((err, ids) => {
      contacts = ids;
      loading = false;
      dispatch("count", { friends: contacts.length });
      console.timeEnd("loading friends");
    })
  );

  patchfox.listen("package:activate:contacts:profile", () => location.reload());
</script>

{#each contacts as contact}
  <AvatarChip feed={contact} on:avatarClick={avatarClick} />
{/each}
{#if loading}
  <div class="loading" />
{/if}
