<script>
  import MessageRenderer from "../messageTypes/MessageRenderer.svelte";
  import { navigate, routeParams } from "../utils.js";
  let profile = false;

  let description = false;
  let following = false;
  let blocking = false;
  let image,
    feed,
    lastMsgs = [],
    lastAbout;

  // todo: move back into using stores.
  feed = $routeParams.feed;

  if (!feed) {
    feed = ssb.feed;
  }

  let name = feed;

  document.title = `Patchfox - Feed: ${feed}`;

  console.log("fetching", feed);
  let p1;
  let p2;

  p1 = ssb.avatar(feed).then(data => {
    name = data.name;
    image = data.image;
    document.title = `Patchfox - Feed: ${name}`;
  });
  p2 = ssb.profile(feed).then(data => {
    lastAbout = data.about.reverse().find(m => {
      let a = m.value.content;
      return a.hasOwnProperty("description");
    });
    if (data.hasOwnProperty("msgs")) {
      lastMsgs = data.msgs;
    }
    try {
      description = lastAbout.value.content.description;
    } catch (n) {
      description = "";
    }
    window.scrollTo(0, 0);
  });

  if (feed !== ssb.feed) {
    ssb.following(feed).then(f => (following = f));
    ssb.blocking(feed).then(f => (blocking = f));
  }

  const blockingChanged = ev => {
    let v = ev.target.checked;
    if (v) {
      ssb.block(feed).catch(() => (blocking = false));
    } else {
      ssb.unblock(feed).catch(() => (blocking = true));
    }
  };

  const followingChanged = ev => {
    let v = ev.target.checked;
    if (v) {
      ssb.follow(feed).catch(() => (following = false));
    } else {
      ssb.unfollow(feed).catch(() => (following = true));
    }
  };
</script>

<div class="container">
  {#await p1 && p2}
    <div class="loading loading-lg" />
  {:then}
    <div class="columns">

      <div class="column col-6">
        <div class="container">
          <img
            class="img-responsive"
            src="http://localhost:8989/blobs/get/{image}"
            alt={feed} />
        </div>
      </div>
      <div class="column col-6">
        <h1>{name}</h1>
        {#if feed !== ssb.feed}
          <div class="container">
            <div class="divider" />
            <div class="form-group">
              <label class="form-switch form-inline">
                <input
                  type="checkbox"
                  on:change={followingChanged}
                  bind:checked={following} />
                <i class="form-icon" />
                following
              </label>
              <label class="form-switch form-inline">
                <input
                  type="checkbox"
                  on:change={blockingChanged}
                  bind:checked={blocking} />
                <i class="form-icon" />
                blocking
              </label>
            </div>
            <div class="divider" />
          </div>
        {/if}
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
