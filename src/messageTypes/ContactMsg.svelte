<script>
  import { navigate } from "../utils.js";

  export let msg;

  let person = msg.value.author;
  let otherPersonFeed = encodeURIComponent(msg.value.content.contact);
  let otherPersonName = otherPersonFeed;
  let verb = msg.value.content.following ? "followed" : "unfollowed";

  ssb.avatar(msg.value.author).then(data => (person = data.name));
  ssb.avatar(otherPersonFeed).then(data => (otherPersonName = data.name));

  const goProfile = ev => {
    ev.stopPropagation();
    ev.preventDefault();
    navigate("/profile", { feed: msg.value.content.contact });
  };
</script>

<div class="card-body">
   {person} {verb}
  <a href="?feed={otherPersonFeed}#/profile" on:click={goProfile}>
    {otherPersonName}
  </a>
</div>
