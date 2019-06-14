<script>
  import { slide } from "svelte/transition";
  import { navigate, routeParams, reconnect } from "../utils.js";

  let showPreview = false;
  let msg = false;
  let error = false;
  let posting = false;

  let root = $routeParams.root;
  let branch = $routeParams.branch;
  let channel = $routeParams.channel || "";
  let content = $routeParams.content || "";

  const post = async ev => {
    ev.stopPropagation();
    ev.preventDefault();

    if (!posting) {
      posting = true;

      if (channel.startsWith("#")) {
        channel = channel.slice(1);
      }

      try {
        msg = await ssb.newPost({ text: content, channel, root, branch });
        posting = false;
        console.log("posted", msg);
      } catch (n) {
        error = true;
        msg = n;

        if (msg.message == "stream is closed") {
          msg += ". We lost connection to sbot. We'll try to restablish it...";

          reconnect()
            .then(() => {
              showPreview = false;
              posting = false;
              error = false;
              msg = "Connection to sbot reestablished. Try posting again";
            })
            .catch(err => {
              window.location.search = `?root=${encodeURIComponent(
                root
              )}&branch=${encodeURIComponent(
                branch
              )}&content=${encodeURIComponent(
                content
              )}&channel=${encodeURIComponent(channel)}`;
              msg = `Sorry, couldn't reconnect to sbot:${err}. Try reloading the page. Your content has been saved to the URL`;
            });
        }
      }
    }
  };

  const preview = ev => {
    showPreview = true;
  };

  const saveToURL = ev => {
    window.location.search = `?root=${encodeURIComponent(
      root
    )}&branch=${encodeURIComponent(branch)}&content=${encodeURIComponent(
      content
    )}&channel=${encodeURIComponent(channel)}`;
  };
</script>

<div class="container">
  <div class="columns">
    <div class="column">
      {#if msg}
        {#if error}
          <div class="toast toast-error">Couldn't post your message: {msg}</div>
        {:else}
          <div class="toast toast-success">
            Your message has been posted. Do you want to
            <a
              target="_blank"
              href="?thread={encodeURIComponent(msg.key)}#/thread">
              Check it out?
            </a>
          </div>
        {/if}
      {/if}
      {#if !showPreview}
        <div class="form-group" in:slide out:slide>
          <label class="form-label" for="channel">Channel</label>
          <input
            class="form-input"
            type="text"
            id="channel"
            placeholder="channel"
            bind:value={channel} />

          {#if branch}
            <label class="form-label" for="reply-to">In reply to</label>
            <input
              class="form-input"
              type="text"
              id="reply-to"
              placeholder="in reply to"
              bind:value={branch} />
          {/if}

          <label class="form-label" for="content">Message</label>
          <textarea
            class="form-input"
            id="content"
            placeholder="Type in your post"
            rows="10"
            bind:value={content} />
          <br />
          <button class="btn btn-primary float-right" on:click={preview}>
            Preview
          </button>
        </div>
      {:else}
        <div class="column col-md-12">
          <h2>Post preview</h2>
          {#if channel || root || branch}
            <blockquote>
              {#if channel}
                <p>
                  <b>Channel:</b>
                   {channel.startsWith('#') ? channel.slice(1) : channel}
                </p>
              {/if}
              {#if root}
                <p>
                  <b>Root:</b>
                   {root}
                </p>
              {/if}
              {#if branch}
                <p>
                  <b>branch:</b>
                   {branch}
                </p>
              {/if}
            </blockquote>
          {/if}
          {@html ssb.markdown(content)}

          <div class="divider" />
          <div class="columns">
            <div class="column col-md-12 col-lg-10">
              <span class="label label-warning">
                This message will be public and can't be edited or deleted
              </span>
            </div>
            <div class="column col-md-12 col-lg-2">
              <button class="btn" on:click={() => (showPreview = false)}>
                Go Back
              </button>
              <button
                class="btn btn-primary"
                class:loading={posting}
                on:click={post}>
                Post
              </button>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
