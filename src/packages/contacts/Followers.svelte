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

  console.time("loading followers");

  onDestroy(() => abortable());

  pull(
    sbot.links({
      dest: feed,
      rel: "contact",
      values: true,
      reverse: true
    }),
    (abortable = Abortable()),
    pull.map(msg => msg && msg.value),
    pull.unique("author"),

    pull.filter(function(value) {
      return value.content && value.content.type === "contact";
    }),
    pull.filter(function(value) {
      return value.content.following === true;
    }),
    pull.map("author"),
    pull.collect((err, ids) => {
      contacts = ids;
      loading = false;
      dispatch("count", {followers: contacts.length});
      console.timeEnd("loading followers");
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
