<script>
  import PostMsg from "./PostMsg.svelte";
  import GenericMsg from "./GenericMsg.svelte";
  import VoteMsg from "./VoteMsg.svelte";
  import PrivateMsg from "./PrivateMsg.svelte";
  import ContactMsg from "./ContactMsg.svelte";
  import ChannelMsg from "./ChannelMsg.svelte";
  import AvatarChip from "../parts/AvatarChip.svelte";
  import timestamp from "../parts/timestamp.js";

  export let msg;

  let type;
  let feed = msg.value.author;

  let messageTypes = {
    "*": GenericMsg,
    post: PostMsg,
    vote: VoteMsg,
    private: PrivateMsg,
    contact: ContactMsg,
    channel: ChannelMsg
  };

  let selectedRenderer;

  if (typeof msg.value.content === "string") {
    type = "private";
  } else {
    type = msg.value.content.type;
  }

  if (messageTypes.hasOwnProperty(type)) {
    selectedRenderer = messageTypes[type];
  } else {
    selectedRenderer = messageTypes["*"];
  }

  let image = "images/icon.png";
  let name = feed;

  ssb.avatar(feed).then(data => {
    if (data.image !== null) {
      image = `http://localhost:8989/blobs/get/${data.image}`;
    }
    name = data.name;
  });
</script>

<div class="card m-2">
  <div class="card-header">
    <div class="float-left">
      <div class="card-title">
        <div class="tile tile-centered">
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
    <div class="float-right">
      <span class="text-gray">
        {#if msg.value.content.channel}#{msg.value.content.channel}{/if}
      </span>
    </div>
  </div>
  <svelte:component this={selectedRenderer} {msg} />
</div>
