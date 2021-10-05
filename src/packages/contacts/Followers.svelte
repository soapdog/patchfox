<script>
  const QueryRepeater = require("../../core/components/QueryRepeater.svelte")
  const AvatarChip = require("../../core/components/AvatarChip.svelte")
  const AvatarContainer = require("../../core/components/AvatarContainer.svelte")
  const Spinner = require("../../core/components/Spinner.svelte")

  const _ = require("lodash")
  const { onDestroy } = require("svelte")
  const { createEventDispatcher } = require("svelte")
  const dispatch = createEventDispatcher()

  export let feed

  let contacts = []
  let loading = true

  const avatarClick = ev => {
    let feed = ev.detail.feed
    let name = ev.detail.name

    patchfox.go("contacts", "profile", { feed })
  }

  console.time("loading followers")

  ssb.friendship.followersAsArray(feed)
    .then(ids => {
      contacts = ids
      loading = false
      dispatch("count", {followers: contacts.length})
      console.timeEnd("loading followers")
    })

  patchfox.listen("package:activate:contacts:profile", () => location.reload())
</script>

<AvatarContainer>
  {#each contacts as contact}
    <AvatarChip feed={contact} on:avatarClick={avatarClick} />
  {/each}
</AvatarContainer>
{#if loading}
  <Spinner />
{/if}
