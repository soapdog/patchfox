<script>
  const QueryRepeater = require("../../core/components/parts/QueryRepeater.svelte");
  const AvatarChip = require("../../core/components/parts/AvatarChip.svelte");
  const pull = require("pull-stream");
  const _ = require("lodash");

  const sbot = ssb.sbot;

  export let feed;

  let contacts = [];

  pull(
    sbot.createUserStream({id: feed, reverse: true}),
    pull.filter(msg => _.get(msg,"msg.value.content.type", false) === "contact"),
    // pull.filter(msg => typeof contacts[msg] !== "undefined"),
    pull.drain(msg => {
      console.log(msg)
      if (!msg.sync) {
        let contact = msg.value.content.contact;
        let following = msg.value.content.following;
        let blocking = msg.value.content.blocking;
        contacts[contact] = {
          contact,
          following,
          blocking
          // todo: arrgghhh!! use follow = true and not blocking
        };
        console.log("adding", contact)
      } else {
        console.log("acabou", contacts)
        contacts = contacts
      }
    })
  );
</script>

{#each contacts as contact}
  {#if contact.following}
    <AvatarChip class="" feed={contact.feed} />
  {/if}
{:else}
  <div class="loading" />
{/each}
