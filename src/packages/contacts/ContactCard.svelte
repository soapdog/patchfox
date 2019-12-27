<script>

  export let msg;

  let person = msg.value.author;
  let otherPersonFeed = encodeURIComponent(msg.value.content.contact);
  let otherPersonName = otherPersonFeed;
  let verb = msg.value.content.following ? "followed" : "unfollowed";

  if (msg.value.content.blocking) {
    verb = "blocked";
  }

  ssb.avatar(msg.value.author).then(data => (person = data.name));
  ssb
    .avatar(msg.value.content.contact)
    .then(data => {
      otherPersonName = data.name;
    })
    .catch(n => console.log(n));

  const goProfile = ev => {
    ev.stopPropagation();
    ev.preventDefault();
    patchfox.go("contacts","profile", { feed: msg.value.content.contact });
  };
</script>

  {verb}
  <a href="?pkg=contacts&view=profile&feed={otherPersonFeed}" on:click={goProfile}>
     {otherPersonName}
  </a>
