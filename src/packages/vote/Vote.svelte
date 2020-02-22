<script>
  const AvatarChip = require("../../core/components/AvatarChip.svelte");

  export let msg;

  let expression = msg.value.content.vote.expression || "liked";
  let msgid = msg.value.content.vote.link;
  let encodedid = encodeURIComponent(msgid);
  let label = msgid;
  let person = msg.value.author;

  ssb
    .blurbFromMsg(msgid, 50)
    .then(blurb => {
      label = blurb;
    })
    .catch(n => {
      console.log("error retrieving blurb for", msgid);
      console.error(n);
    });

  ssb.avatar(msg.value.author).then(data => (person = data.name));

  const goThread = ev => {
    ev.stopPropagation();
    ev.preventDefault();
    if (typeof msgid === "undefined") {
      throw "Can't go to undefined message id";
      return false;
    }
    if (ev.ctrlKey) {
      window.open(`?pkg=hub&view=thread&thread=${encodeURIComponent(msgid)}`);
    } else {
      patchfox.go("hub", "thread", { thread: msgid });
    }
  };
</script>

<p class="m-2">
  <AvatarChip feed={msg.value.author} /> {expression}
  <a href="?pkg=hub&view=thread&thread={encodedid}" on:click={goThread}>
    {label}
  </a>
</p>
