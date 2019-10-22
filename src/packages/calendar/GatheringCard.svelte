<script>
  const Scuttle = require("scuttle-gathering");
  const gathering = Scuttle(ssb.sbot);

  export let msg;

  let msgid = msg.key;
  let person = msg.value.author;
  let event = false;
  let attending;
  let notAttending;

  ssb.avatar(msg.value.author).then(data => (person = data.name));

  gathering.get(msgid, (err, data) => {
    console.log(data);
    if (!err) {
      event = data;
      attending = event.isAttendee;
      notAttending = data.notAttendees.includes(ssb.sbot.id);
    }
  });

  const dateToNiceDate = epoch => {
    let date = new Date(epoch).toLocaleDateString();
    let time = new Date(epoch).toLocaleTimeString();
    return `${date} ${time}`;
  };

  const attend = () => {
    gathering.attending(msgid, true, (err, data) => {
      console.log(err)
      console.log(data)
      if (!err) {
        attending = true;
        notAttending = false;
      }
    })
  }

  const notAttend = () => {
    gathering.attending(msgid, false, (err, data) => {
      if (!err) {
        notAttending = true;
        attending = false;
      }
    })
  }
</script>

<style>
  img.gathering-image {
    max-width: 100%;
  }
</style>

<div class="card-body">
  {#if event}
    <h1 class="title">{event.title}</h1>
    <h2 class="subtitle">{dateToNiceDate(event.startDateTime.epoch)}</h2>
    {#if event.image}
      <img
        class="gathering-image"
        src="http://localhost:8989/blobs/get/{encodeURIComponent(event.image.link)}"
        alt={event.image.name} />
    {/if}
    <p>{event.description}</p>
  {/if}
</div>
<div class="card-footer">
  <div class="columns col-gapless">
    <div class="column col-6">
      <div class="btn-group btn-group-block">
        <button class="btn" on:click={notAttend} class:btn-primary={notAttending === true}>Not Attending</button>
        <button class="btn" on:click={attend} class:btn-primary={attending === true}>Attending</button>
      </div>
    </div>

    <div class="column col-6 text-right">
      <button class="btn" on:click={() => {}}>View details</button>
    </div>
  </div>
</div>
