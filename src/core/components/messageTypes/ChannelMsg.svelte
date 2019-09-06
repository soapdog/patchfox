<script>

  export let msg;

  let person = msg.value.author;
  let verb = msg.value.content.subscribed ? "subscribed" : "unsubscribed";
  let channel = encodeURIComponent(msg.value.content.channel);

  ssb.avatar(msg.value.author).then(data => (person = data.name));

   const goChannel = ev => {
    ev.stopPropagation();
    ev.preventDefault();
    navigate("/channel", { channel: msg.value.content.channel });
  };
</script>

<div class="card-body">
   {person} {verb}
  <a href="?channel={channel}#/channel" on:click={goChannel}>#{channel}</a>
</div>
