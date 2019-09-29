<script>
  const QueryRepeater = require("../../core/components/parts/QueryRepeater.svelte");
  const AvatarChip = require("../../core/components/parts/AvatarChip.svelte");

  export let feed;

  let contacts = [];

  let query = [
    {
      $filter: {
        value: {
          author: feed,
          content: {
            type: "contact"
          }
        }
      }
    }
  ];

  pull(
      sbot.query.read({
          query
      }),
      pull.drain(msg => {
          if (!msg.sync) {
              let feed = msg.value.content.contact
              let following = msg.value.content.following
              let blocking = msg.value.content.blocking
              contacts[key] = {
                  feed,
                  // todo: arrgghhh!! use follow = true and not blocking

              }
          }
      })
  )
</script>


{#each contacts as contact}
  <AvatarChip feed={msg.value.content.contact} />
{/each}
