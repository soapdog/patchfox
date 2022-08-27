<script>
  const _ = require("lodash")
  const pull = require("pull-stream")
  const Abortable = require("pull-abortable")
  const { onDestroy, tick } = require("svelte")
  const paramap = require("pull-paramap")
  const sort = require("pull-sort")
  const Scuttle = require("scuttle-gathering")
  const gathering = Scuttle(ssb.sbot)
  const sbot = ssb.sbot

  let loading = true
  let abortable
  let gatherings = []

  onDestroy(() => abortable())

  console.time("loading gatherings")

  // bounty: the query used to find future events might be incomplete.

  let currentDate = new Date().getTime()

  if (ssb.platform === "nodejs-db1") {
    pull(
      sbot.messagesByType({
        type: "gathering",
        gt: (currentDate / 1000) | 0
        // lt: (twoYearsFromNow.getTime() / 1000) | 0
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
        let twoYearsFromNow = new Date()
        twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2)
        return event.startDateTime.epoch > currentDate && event.startDateTime.epoch < twoYearsFromNow.getTime()
      }),
      sort((e1, e2) => {
        if (e1.startDateTime.epoch == e2.startDateTime.epoch) {
          return 0
        }

        if (e1.startDateTime.epoch > e2.startDateTime.epoch) {
          return 1
        }

        return -1
      }),
      pull.collect((err, events) => {
        let groups = _.groupBy(events, event => {
          let date = new Date(event.startDateTime.epoch)
          return date.toISOString().slice(0, 7)
        })
        let keys = Object.keys(groups)

        gatherings = keys.map(k => {
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
</script>

<style>
  .events-display {
    width: 90%;
    margin: auto;
  }
</style>

<div class="events-display">
  {#if loading}
    {@html ssb.markdown('This query shows future events up to two years from now. It might take a while, go grab some :coffee: or :tea: ...')}
    <div class="loading" />
  {:else}
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

      {#each gatherings as group}
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
