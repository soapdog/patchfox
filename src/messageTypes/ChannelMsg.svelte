<script>
  export let msg;

  let person = msg.value.author;
  let verb = msg.value.content.subscribed ? "subscribed" : "unsubscribed";
  let channel = msg.value.content.channel;

  ssb.avatar(msg.value.author).then(data => (person = data.name));
</script>

<div class="card-body">
   {person} {verb}
  <a href="#/channel/{channel}">#{channel}</a>
</div>
