<script>
  import MessageRenderer from "../messageTypes/MessageRenderer.svelte";
  import { navigate, routeParams } from "../utils.js";
  let profile = false;

  let description = false;
  let name,
    image,
    feed,
    lastMsgs = [],
    lastAbout;

  // todo: move back into using stores.
  feed = $routeParams.feed;
  console.log("fetching", feed);
  let p1 = ssb.avatar(feed).then(data => {
    name = data.name;
    image = data.image;
  });
  let p2 = ssb.profile(feed).then(data => {
    lastAbout = data.about.reverse().find(m => {
      let a = m.value.content;
      return a.hasOwnProperty("description");
    });
    if (data.hasOwnProperty("msgs")) {
      lastMsgs = data.msgs;
    }
    try {
      description = lastAbout.value.content.description;
      console.log("d", description);
    } catch (n) {
      console.log("err", n);
      console.log("profile", data);
      description = "";
    }
    window.scrollTo(0, 0);
  });
</script>

<div class="container">
  {#await p1 && p2}
    <p>Loading...</p>
  {:then}
    <div class="columns">

      <div class="column col-6">
        <img
          class="img-responsive"
          src="http://localhost:8989/blobs/get/{image}"
          alt={feed} />
      </div>
      <div class="column col-6">
        <h1>{name}</h1>
        <p>
          {@html ssb.markdown(description)}
        </p>
      </div>
    </div>

    <div>
      {#each lastMsgs as msg (msg.key)}
        <MessageRenderer {msg} />
      {/each}
    </div>
  {:catch n}
    <p>Error: {n.message}</p>
  {/await}
</div>
