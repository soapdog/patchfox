<script>
  const _ = require("lodash")
  const pull = require("pull-stream")
  const Abortable = require("pull-abortable")
  const { onDestroy, tick } = require("svelte")
  const paramap = require("pull-paramap")
  const sort = require("pull-sort")
  const Scuttle = require("scuttle-gathering")
  const ics = require("ics")
  const gathering = Scuttle(ssb.sbot)
  const sbot = ssb.sbot

  let loading = true
  let abortable
  let events = []
  let groupedEvents = []

  onDestroy(() => abortable())

  console.time("loading gatherings")

  let currentDate = new Date().getTime()
  console.log(currentDate)

  if (ssb.serverType === "nodejs-ssb") {
    pull(
      sbot.messagesByType({
        type: "gathering",
        gt: (currentDate / 1000) | 0
      }),
      (abortable = Abortable()),
      pull.filter(function(msg) {
        return (
          msg &&
          msg.value &&
          msg.value.content &&
          msg.value.content.type === "gathering"
        )
      }),
      paramap((msg, cb) => {
        gathering.get(msg.key, (err, data) => {
          msg.event = data
          cb(null, msg)
        })
      }),
      pull.map("event"),
      pull.filter(event => {
        if (!event.startDateTime) {
          return false
        }
        return event.startDateTime.epoch > currentDate
      }),
      pull.filter(e => e.isAttendee),
      sort((e1, e2) => {
        if (e1.startDateTime.epoch == e2.startDateTime.epoch) {
          return 0
        }

        if (e1.startDateTime.epoch > e2.startDateTime.epoch) {
          return 1
        }

        return -1
      }),
      pull.collect((err, gs) => {
        events = gs
        let groups = _.groupBy(gs, event => {
          let date = new Date(event.startDateTime.epoch)
          return date.toISOString().slice(0, 7)
        })
        let keys = Object.keys(groups)

        groupedEvents = keys.map(k => {
          return { name: k, events: groups[k] }
        })

        loading = false
        console.timeEnd("loading gatherings")
      })
    )
  }

  const dateToNiceDate = epoch => {
    let date = new Date(epoch).toLocaleDateString()
    let time = new Date(epoch).toLocaleTimeString()
    return `${date} ${time}`
  }

  const monthAndYear = s => {
    let str = `${s}-01`
    let date = new Date(str)
    return date.toLocaleDateString("en-GB", { year: "numeric", month: "long" })
  }

  const getEventAttendees = e => {
    let attendeesP = e.attendees.map(async id => {
      let feed = await ssb.avatar(id)
      return { name: feed.name, rsvp: true }
    })
    let notAttendeesP = e.notAttendees.map(async id => {
      let feed = await ssb.avatar(id)
      return { name: feed.name, rsvp: false }
    })

    return Promise.all(attendeesP.concat(notAttendeesP))
  }
  // fixme: all of this is broken
  
  const gatheringToEventObj = async e => {
    let attendees = await getEventAttendees(e)

    let obj = {
      title: e.title,
      description: e.description
    }

    if (e.location) {
      obj.location = e.location
    }

    if (e.attendees) {
      obj.attendees = attendees
    }
    console.log(obj)
    return obj
  }

  const exportToICS = () => {
    let ee = events.map(e => gatheringToEventObj(e))
    console.log(ee)
    Promise.all(ee, es => {
      console.log("es", es)
      const { error, value } = ics.createEvents(es)

      if (error) {
        console.log(error)
      }

      console.log(value)
    })
  }
</script>

<style>
  .events-display {
    width: 90%;
    margin: auto;
  }
</style>

<div class="events-display">
  {#if loading}
    {@html ssb.markdown("This query might take a while, go grab some :coffee: or :tea: ...")}
    <div class="loading" />
  {:else}
    <h1 class="h1">Export future events</h1>
    <p>These are the future events you're attenting. You can:</p>
    <button class="btn" on:click={exportToICS}>Export as iCal file</button>

    <div class="timeline">
      <div class="timeline-item" id="timeline-example-1">
        <div class="timeline-left">
          <a class="timeline-icon" href="#timeline-example-1" />
        </div>
        <div class="timeline-content">
          <div class="tile-content">
            <p class="tile-title">Today: {dateToNiceDate(new Date())}</p>
          </div>
        </div>
      </div>

      {#each groupedEvents as group}
        <div class="timeline-item" id="timeline-example-2">
          <div class="timeline-left">
            <a class="timeline-icon icon-lg" href="#timeline-example-2">
              <i class="icon icon-check" />
            </a>
          </div>
          <div class="timeline-content">
            <div class="tile">
              <div class="tile-content">
                <h2 class="tile-title h2">{monthAndYear(group.name)}</h2>
                {#each group.events as event}
                  <p class="tile-subtitle">
                    {event.title}
                    {#if event.startDateTime}
                      <span class="chip">
                        {dateToNiceDate(event.startDateTime.epoch)}
                      </span>
                    {/if}
                    <a
                      class="btn btn-sm"
                      href="?pkg=calendar&view=gathering&msgid={encodeURIComponent(event.key)}"
                      on:click={() => patchfox.go('calendar', 'gathering', {
                          msgid: event.key
                        })}>
                      View
                    </a>
                  </p>
                {/each}
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
