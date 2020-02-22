<script>
  const AvatarChip = require("../../core/components/AvatarChip.svelte");

  export let msg;

  let person = msg.value.author;
  let verb = msg.value.content.subscribed ? "subscribed" : "unsubscribed";
  let channel = encodeURIComponent(msg.value.content.channel);

  ssb.avatar(msg.value.author).then(data => (person = data.name));

  const goChannel = ev => {
    ev.stopPropagation();
    ev.preventDefault();
    patchfox.go("hub", "channel", { channel: msg.value.content.channel });
  };
</script>

<p class="m-2">
  <AvatarChip feed={msg.value.author} />
  {verb}
  <a href="?pkg=hub&view=channel&channel={channel}" on:click={goChannel}>
    #{channel}
  </a>
</p>
