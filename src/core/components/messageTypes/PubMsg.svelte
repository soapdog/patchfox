<script>
  export let msg;

  let encodedid = encodeURIComponent(msg.value.content.address.key);
  let person = msg.value.author;
  let host = msg.value.content.address.host
  let port = msg.value.content.address.port

  ssb.avatar(msg.value.author).then(data => (person = data.name));

  
  const goProfile = ev => {
    ev.stopPropagation();
    ev.preventDefault();
    navigate("/profile", { feed: msg.value.content.address.key });
  };
</script>

<div class="card-body">
   {person} announced pub
  <a href="/index.html?feed={encodedid}#/profile" on:click={goProfile}>{host}:{port}</a>
</div>
