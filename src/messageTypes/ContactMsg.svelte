<script>
  export let msg;


  let person = msg.value.author;
  let otherPersonFeed = msg.value.content.contact;
  let otherPersonName = otherPersonFeed;
  let verb = msg.value.content.following ? "followed" : "unfollowed"

  ssb.avatar(msg.value.author).then(data => (person = data.name));
  ssb.avatar(otherPersonFeed).then(data => (otherPersonName = data.name));

</script>

<div class="card-body"> 
{person} {verb} <a href="#/profile/{otherPersonFeed}">{otherPersonName}</a>
</div>
