<script>
  export let msg;

  let expression = msg.value.content.vote.expression;
  let msgid = msg.value.content.vote.link;
  let label = msgid;
  let person = msg.value.author;

  ssb.blurbFromMsg(msgid, 100).then(blurb => {
    label = blurb;
  });

  ssb.avatar(msg.value.author).then(data => (person = data.name));
</script>

<div class="card-body">
{person} {expression}
<a href="#/thread/{msgid}">{label}</a>
</div>
