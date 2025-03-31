<script>
  const AvatarChip = require("../../core/components/AvatarChip.svelte")

  export let msg

  let encodedid = encodeURIComponent(msg.value.content.address.key)
  let person = msg.value.author
  let host = msg.value.content.address.host
  let port = msg.value.content.address.port

  ssb.avatar(msg.value.author).then(data => (person = data.name))

  
  const goProfile = ev => {
    ev.stopPropagation()
    ev.preventDefault()
    patchfox.go("contacts","profile", { feed: msg.value.content.address.key })
  }
</script>

<p class="m-2">
  <AvatarChip inline={true} arrow={true} feed={msg.value.author} />
  
   announced pub
  <a href="?pkg=contacts&view=profile&feed={encodedid}" on:click={goProfile}>{host}:{port}</a>
</p>
