<script>
  const AvatarChip = require("../../core/components/AvatarChip.svelte")

  export let msg

  let person = msg.value.author
  let verb = msg.value.content.subscribed ? "subscribed" : "unsubscribed"
  let channel = encodeURIComponent(msg.value.content.channel)

  ssb.avatar(msg.value.author).then(data => (person = data.name))

  const goChannel = ev => {
    ev.stopPropagation()
    ev.preventDefault()
    patchfox.go("hub", "channel", { channel: msg.value.content.channel })
  }

  const avatarClick = ev => {
    let feed = ev.detail.feed
    patchfox.go("contacts", "profile", { feed })
  }

</script>

<p class="m-2">
  <AvatarChip inline={true} arrow={true} feed={msg.value.author} on:avatarClick={avatarClick} />
  {verb}
  <a href="?pkg=hub&view=channel&channel={channel}" on:click={goChannel}>
    #{channel}
  </a>
</p>
