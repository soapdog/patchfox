<script>
  export let msg;

  let expression = msg.value.content.vote.expression || "liked";
  let msgid = msg.value.content.vote.link;
  let encodedid = encodeURIComponent(msgid);
  let label = msgid;
  let person = msg.value.author;

  ssb.blurbFromMsg(msgid, 100).then(blurb => {
    label = blurb;
  }).catch(n => {
    console.log("error retrieving blurb for", msgid)
    console.error(n)
  });

  ssb.avatar(msg.value.author).then(data => (person = data.name));

  const goThread = ev => {
    ev.stopPropagation();
    ev.preventDefault();
    if (ev.ctrlKey) {
      window.open(`?thread=${encodeURIComponent(msgid)}#/thread`);
    } else {
      patchfox.go("hub", "thread", { thread: msgid });
    }
  };
</script>

<div class="card-body">
   {person} {expression}
  <a href="/index.html?thread={encodedid}#/thread" on:click={goThread}>
     {label}
  </a>
</div>
