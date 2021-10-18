<script>
  const Card = require("../../core/components/ui/Card.svelte")
  const Scuttle = require("scuttle-gathering")
  const gathering = Scuttle(ssb.sbot)

  export let msg

  let msgid = msg.key
  let person = msg.value.author
  let event = false
  let showRaw = false
  let attending
  let notAttending

  ssb.avatar(msg.value.author).then(data => (person = data.name))

  gathering.get(msgid, (err, data) => {
    console.log(data)
    if (!err) {
      event = data
      attending = event.isAttendee
      notAttending = data.notAttendees.includes(ssb.feed)
    }
  })

  const dateToNiceDate = epoch => {
    let date = new Date(epoch).toLocaleDateString()
    let time = new Date(epoch).toLocaleTimeString()
    return `${date} ${time}`
  }

  const attend = () => {
    gathering.attending(msgid, true, (err, data) => {
      if (!err) {
        attending = true
        notAttending = false
      }
    })
  }

  const notAttend = () => {
    gathering.attending(msgid, false, (err, data) => {
      if (!err) {
        notAttending = true
        attending = false
      }
    })
  }
</script>

<style>
  img.gathering-image {
    max-width: 100%;
  }
</style>

<Card {msg} {showRaw}>
  {#if event}
    <h1 class="uppercase font-medium">{event.title}</h1>
    {#if event.startDateTime}
      <h2 class="uppercase">{dateToNiceDate(event.startDateTime.epoch)}</h2>
    {/if}
    {#if event.image}
      <img
        class="gathering-image"
        src={patchfox.httpUrl("/blobs/get/" + encodeURIComponent(event.image.link))}
        alt={event.image.name} />
    {/if}
    <div class="prose">
    {@html ssb.markdown(event.description)}
    </div>
  {/if}
  <div class="card-actions" slot="card-actions">
  
        <div class="btn-group">
          <button
            class="btn btn-outline"
            on:click={notAttend}
            class:btn-active={notAttending === true}>
            Not Attending
          </button>
          <button
            class="btn btn-outline"
            on:click={attend}
            class:btn-active={attending === true}>
            Attending
          </button>
    </div>
        <button
          class="btn"
          on:click={() => {
            patchfox.go("calendar", "gathering", { msgid })
          }}>
          View details
        </button>
  </div>
</Card>
