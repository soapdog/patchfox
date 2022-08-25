<script>
  const Card = require("../../core/components/ui/Card.svelte")
  const Scuttle = require("scuttle-gathering")
  const AvatarChip = require("../../core/components/AvatarChip.svelte")
  const AvatarContainer = require("../../core/components/AvatarContainer.svelte")

  const gathering = Scuttle(ssb.sbot)
  const ics = require("ics")
  const moment = require("moment")
  const { timestamp } = require("../../core/components/timestamp.js")
  const pull = require("pull-stream")
  const paramap = require("pull-paramap")
  const toPull = require("pull-promise")

  export let msgid

  let msg = false
  let name
  let feed
  let event = false
  let loadedAllData = false
  let showRaw = false
  let attending
  let notAttending
  let image

  ssb.get(msgid).then(data => {
    msg = {value: data}
    feed = msg.value.author
    name = feed


    ssb.avatar(feed).then(data => {
      if (data.image !== null) {
        image = patchfox.blobUrl(data.image)
      }
      name = data.name
    })
  })

  gathering.get(msgid, (err, data) => {
    if (!err) {
      event = data
      attending = event.isAttendee
      notAttending = data.notAttendees.includes(ssb.feed)
      loadedAllData = true
      patchfox.title(event.title)
    }
  })

  const dateToNiceDate = epoch => {
    let date = new Date(epoch).toLocaleDateString()
    let time = new Date(epoch).toLocaleTimeString()
    return `${date} ${time}`
  }

  const attend = () => {
    gathering.attending(msgid, true, (err, data) => {
      console.log(err)
      console.log(data)
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

  const avatarClick = ev => {
    let feed = ev.detail.feed
    let name = ev.detail.name

    patchfox.go("contacts", "profile", { feed })
  }

  const goProfile = ev => {
    if (ev.ctrlKey) {
      window.open(
        `?pkg=contacs&view=profile&feed=${encodeURIComponent(feed)}#/profile`
      )
    } else {
      patchfox.go("contacts", "profile", { feed })
    }
  }

  const exportToICS = ev => {
    pull(
      pull.values(event.attendees),
      paramap((attendee, cb) => {
        ssb.avatar(attendee).then(a => cb(null, { name: a.name, rsvp: true }))
      }),
      pull.collect((err, attendees) => {
        if (err) {
          console.log("err")
          throw err
        }
        let el = document.createElement("div")
        el.innerHTML = ssb.markdown(event.description)
        let obj = {
          title: event.title,
          description: el.innerText
        }

        if (event.location) {
          obj.location = event.location
        }

        obj.start = moment(event.startDateTime.epoch)
          .format("YYYY-M-D-H-m")
          .split("-")

        obj.duration = { hours: 1 }
        obj.organizer = { name: name }
        obj.attendees = attendees

        let { error, value } = ics.createEvent(obj)

        if (error) {
          throw `Can't generate iCal ${error}`
        } else {
          let blob = new Blob([value], { type: "text/calendar" })

          const a = document.createElement("a")
          a.style.display = "none"
          document.body.appendChild(a)

          // Set the HREF to a Blob representation of the data to be downloaded
          a.href = window.URL.createObjectURL(blob)

          // Use download attribute to set set desired file name
          a.setAttribute("download", `${event.title}.ics`)

          // Trigger the download by simulating click
          a.click()

          // Cleanup
          window.URL.revokeObjectURL(a.href)
          document.body.removeChild(a)
        }
      })
    )
  }
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

  .card-footer {
    padding-right: 15px;
  }
</style>

{#if event  && msg}
  <Card {showRaw} {msg}>
    <h1 class="uppercase font-medium">{event.title}</h1>
    {#if event.startDateTime}
      <h2 class="uppercase">{dateToNiceDate(event.startDateTime.epoch)}</h2>
    {/if}
    {#if event.image}
      <img
        class="gathering-image"
        src="{patchfox.blobUrl(encodeURIComponent(event.image.link))}"
        alt={event.image.name} />
    {/if}
    
    <div class="prose">
    {@html ssb.markdown(event.description)}
    </div>

    <h3 class="uppercase font-medium mt-4">Attending</h3>

    <AvatarContainer>
    {#each event.attendees as attendee}
        <AvatarChip feed={attendee} on:avatarClick={avatarClick} />
    {:else}
      <p>This gathering has no atteendees yet</p>
    {/each}
    </AvatarContainer>

    <h3 class="uppercase font-medium mt-4">Not Attending</h3>

    <AvatarContainer>
    {#each event.notAttendees as notAttendee}
        <AvatarChip
          feed={notAttendee}
          on:avatarClick={avatarClick} />
    {:else}
      <p>This gathering has no people not attending it yet</p>
    {/each}
    </AvatarContainer>

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
          <button class="btn" disabled={!loadedAllData} on:click={exportToICS}>
            Export as iCal
          </button>
      </div>
  </Card>
{:else}
  <div class="loading" />
{/if}
