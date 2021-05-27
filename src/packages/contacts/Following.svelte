<script>
  const QueryRepeater = require("../../core/components/QueryRepeater.svelte");
  const AvatarChip = require("../../core/components/AvatarChip.svelte");
  const AvatarContainer = require("../../core/components/AvatarContainer.svelte");
  const pull = require("pull-stream");
  const Abortable = require("pull-abortable");
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

  console.time("loading following");

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
    pull.map("contact"),
    pull.collect((err, ids) => {
      contacts = ids;
      loading = false;
      dispatch("count", {following: contacts.length});
      console.timeEnd("loading following");
    })
  );

  patchfox.listen("package:activate:contacts:profile", () => location.reload());
</script>
<AvatarContainer>
  {#each contacts as contact}
    <AvatarChip feed={contact} on:avatarClick={avatarClick} />
  {/each}
</AvatarContainer>
{#if loading}
  <div class="loading" />
{/if}
