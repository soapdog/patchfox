<script>
  const Scuttle = require("scuttle-gathering");
  const AvatarRound = require("../../core/components/parts/AvatarRound.svelte");
  const gathering = Scuttle(ssb.sbot);

  export let msgid;

  let msg;
  let person;
  let event = false;
  let attending;
  let notAttending;
  ssb.get(msgid).then(data => {
    msg = data;
    person = msg.author;

    ssb.avatar(msg.author).then(data => (person = data.name));
  });

  gathering.get(msgid, (err, data) => {
    if (!err) {
      event = data;
      attending = event.isAttendee;
      notAttending = data.notAttendees.includes(ssb.sbot.id);
      console.log("event", event);
    }
  });

  const dateToNiceDate = epoch => {
    let date = new Date(epoch).toLocaleDateString();
    let time = new Date(epoch).toLocaleTimeString();
    return `${date} ${time}`;
  };

  const attend = () => {
    gathering.attending(msgid, true, (err, data) => {
      console.log(err);
      console.log(data);
      if (!err) {
        attending = true;
        notAttending = false;
      }
    });
  };

  const notAttend = () => {
    gathering.attending(msgid, false, (err, data) => {
      if (!err) {
        notAttending = true;
        attending = false;
      }
    });
  };

  const avatarClick = ev => {
    let feed = ev.detail.feed;
    let name = ev.detail.name;

    patchfox.go("contacts", "profile", { feed });
  };
</script>

<style>
  img.gathering-image {
    max-width: 100%;
  }

  span.contains-avatar {
    padding: 2px;
  }

  .card-body {
    padding-bottom: 15px;
  }
</style>

{#if event}
  <div class="card-body">
    <h1 class="title">{event.title}</h1>
    <h2 class="subtitle">{dateToNiceDate(event.startDateTime.epoch)}</h2>
    {#if event.image}
      <img
        class="gathering-image"
        src="http://localhost:8989/blobs/get/{encodeURIComponent(event.image.link)}"
        alt={event.image.name} />
    {/if}
    {@html ssb.markdown(event.description)}
    <h3 class="h3">Attending</h3>
    {#each event.attendees as attendee}
      <span class="contains-avatar">
        <AvatarRound feed={attendee} on:avatarClick={avatarClick} />
      </span>
    {:else}
      <p>This gathering has no atteendees yet</p>
    {/each}
    <h3 class="h3">Not Attending</h3>

    {#each event.notAttendees as notAttendee}
      <span class="contains-avatar">
        <AvatarRound dim=true feed={notAttendee} on:avatarClick={avatarClick} />
      </span>
    {:else}
      <p>This gathering has no people not attending it yet</p>
    {/each}
  </div>
  <div class="card-footer">
    <div class="columns col-gapless">
      <div class="column col-6">
        <div class="btn-group btn-group-block">
          <button
            class="btn"
            on:click={notAttend}
            class:btn-primary={notAttending === true}>
            Not Attending
          </button>
          <button
            class="btn"
            on:click={attend}
            class:btn-primary={attending === true}>
            Attending
          </button>
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="loading" />
{/if}
