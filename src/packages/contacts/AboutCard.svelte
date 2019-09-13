<script>
  export let msg;

  let person = msg.value.author;
  let otherLink = encodeURIComponent(msg.value.content.about);
  let otherName = msg.value.content.name || msg.value.content.about;
  let isThisAboutFeeds = true;
  let verb =
    msg.value.content.about === msg.value.author
      ? "self-identifies"
      : "identifies";

  ssb.avatar(msg.value.author).then(data => (person = data.name));

  if (otherName === msg.value.content.about) {
    ssb.avatar(msg.value.content.about).then(data => (otherName = data.name));
  }

  let image = msg.value.content.image
    ? `http://localhost:8989/blobs/get/${encodeURIComponent(
        msg.value.content.image
      )}`
    : false;

  if (msg.value.content.description) {
    verb += " with description";
  }

  if (msg.value.content.about.startsWith("%")) {
    isThisAboutFeeds = false; // this appear to be a gathering
  }
</script>

<div class="card-body">
  {#if isThisAboutFeeds}
    {person} {verb}
    <a href="?pkg=contacts&view=profile&feed={otherLink}"
      on:click|preventDefault={() => patchfox.go("contacts","profile", {feed: otherLink})}>
      {#if image}
        <div class="chip">
          <img src={image} class="avatar avatar-sm" alt={otherName} />
           {otherName}
        </div>
      {:else}
        <span class="chip">{otherName}</span>
      {/if}
    </a>
    {#if msg.value.content.description}
      <blockquote>
        {@html ssb.markdown(msg.value.content.description)}
      </blockquote>
    {/if}
  {:else}
    <div class="toast">
       {person} is doing something related to a gathering but gatherings are not
      supported yet, sorry.
    </div>
  {/if}
</div>
