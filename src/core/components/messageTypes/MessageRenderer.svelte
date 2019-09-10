<script>
  const PostMsg = require("./PostMsg.svelte");
  const GenericMsg = require("./GenericMsg.svelte");
  const VoteMsg = require("./VoteMsg.svelte");
  const PrivateMsg = require("./PrivateMsg.svelte");
  const ContactMsg = require("./ContactMsg.svelte");
  const ChannelMsg = require("./ChannelMsg.svelte");
  const AboutMsg = require("./AboutMsg.svelte");
  const PubMsg = require("./PubMsg.svelte");
  const BlogMsg = require("./BlogMsg.svelte");
  const AvatarChip = require("../parts/AvatarChip.svelte");
  const {timestamp} = require("../parts/timestamp.js");
  const { isMessageBlured } = require("../../platforms/ssb/abusePrevention.js");

  export let msg;

  let type;
  let feed = msg.value.author;
  let showRaw = false;
  let rawContent = JSON.stringify(msg, null, 2);
  let dropdownActive = false;
  let privateMsgForYou = false;

  let messageTypes = {
    "*": GenericMsg,
    post: PostMsg,
    vote: VoteMsg,
    private: PrivateMsg,
    contact: ContactMsg,
    channel: ChannelMsg,
    about: AboutMsg,
    pub: PubMsg,
    blog: BlogMsg
  };

  let selectedRenderer;

  if (typeof msg.value.content === "string") {
    type = "private";
  } else {
    type = msg.value.content.type;
  }

  if (msg.value.private) {
    privateMsgForYou = true;
  }

  if (messageTypes.hasOwnProperty(type)) {
    selectedRenderer = messageTypes[type];
  } else {
    selectedRenderer = messageTypes["*"];
  }

  let image = "images/icon.png";
  let name = feed;
  let blured = isMessageBlured(msg);

  ssb.avatar(feed).then(data => {
    if (data.image !== null) {
      image = `http://localhost:8989/blobs/get/${data.image}`;
    }
    name = data.name;
  });

  const toggleRawMessage = () => {
    showRaw = !showRaw;
    dropdownActive = false;
  };

  const copyPermalink = () => {
    navigator.clipboard
      .writeText(`ssb:${msg.key}`)
      .then(() => console.log("permalink copied"))
      .catch(err => console.error("can't copy permalink", err));

    dropdownActive = false;
  };

  const copyHash = () => {
    navigator.clipboard
      .writeText(`${msg.key}`)
      .then(() => console.log("hash copied"))
      .catch(err => console.error("can't copy hash", err));

    dropdownActive = false;
  };

  const goProfile = ev => {
    if (ev.ctrlKey) {
      window.open(`?feed=${encodeURIComponent(feed)}#/profile`);
    } else {
      //navigate("/profile", { feed });
    }
  };
</script>

<style>
  .blured img {
    filter: blur(20px) !important;
  }

  .blured {
    border: solid 2px red;
  }
  .raw-content {
    width: 50%;
  }

  .feed-display {
    cursor: pointer;
  }

  .channel-display {
    cursor: pointer;
  }

  .menu-right {
    right: 0px;
    left: unset;
    min-width: 300px;
  }

  .private {
    border: solid 2px orange;
  }
</style>

<div class="card m-2" augmented-ui="br-clip exe" class:private={privateMsgForYou} class:blured>
  <div class="card-header">
    <div class="float-left">
      <div class="card-title">
        <div class="tile tile-centered feed-display" on:click={goProfile}>
          <div class="tile-icon">
            <div class="example-tile-icon">
              <img src={image} class="avatar avatar-lg" alt={feed} />
            </div>
          </div>
          <div class="tile-content">
            <div class="tile-title">{name}</div>
            <small class="tile-subtitle text-gray">
               {timestamp(msg.value.timestamp)}
            </small>
          </div>
        </div>
      </div>
    </div>
    {#if privateMsgForYou}
      <span class="label">PRIVATE</span>
    {/if}
    <div class="float-right">
      <span
        class="text-gray channel-display"
        on:click={() => {
          // navigate('/channel', {
          //   channel: msg.value.content.channel
          // })
        }}>
        {#if msg.value.content.channel}#{msg.value.content.channel}{/if}
      </span>
      <div class="dropdown">
        <span
          class="btn btn-link dropdown-toggle"
          tabindex="0"
          class:active={dropdownActive}
          on:click={() => (dropdownActive = !dropdownActive)}>
          <i class="icon icon-more-vert" />
        </span>
        <ul class="menu menu-right">
          <li class="menu-item">

            <a
              href="?thread={encodeURIComponent(msg.key)}#/thread"
              target="_blank">
              <i class="icon icon-share" />
              Open in new tab
            </a>
          </li>
          <li class="menu-item">
            <a href="#" on:click|preventDefault={copyPermalink}>
              <i class="icon icon-copy" />
              Copy permalink to clipboard
            </a>
          </li>
          <li class="menu-item">
            <a href="#" on:click|preventDefault={copyHash}>
              <i class="icon icon-copy" />
              Copy message id to clipboard
            </a>
          </li>
          <li class="divider" data-content="FOR THE CURIOUS" />
          <li class="menu-item">
            <a href="#" on:click|preventDefault={toggleRawMessage}>
              <i class="icon icon-message" />
              {#if !showRaw}Show raw message{:else}Close raw message{/if}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
  {#if !showRaw}
    <svelte:component this={selectedRenderer} {msg} />
  {:else}
    <div class="card-body">
      <div class="columns">
        <div class="column col-9">
          <pre class="code">
            <code>{rawContent}</code>
          </pre>
        </div>
        <div class="column col-3">
          <p>
            This is a message of type
            <em>{type}</em>
            .
          </p>
          <p>
            To learn more about it, go to
            <a target="_blank" href="/docs/index.html#/message_types/{type}">
              the documentation about messages with type {type}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  {/if}
</div>
