<script>
  // adapted from: https://svelte.dev/repl/cb4d121decc54cc98e312d5b83c96df7?version=3.17.2
  const calendarize = require("calendarize")
  const Arrow = require("./Arrow.svelte")
  const { createEventDispatcher } = require("svelte")
  const pull = require("pull-stream")
  const dispatch = createEventDispatcher()
  
  export let offset = 0 // Sun
  export let today = new Date() // Date
  export let year = today.getFullYear()
  export let month = today.getMonth() // Jan
  
  export let labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  export let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]

  let msgs = []
  
  $: today_month = today && today.getMonth()
  $: today_year = today && today.getFullYear()
  $: today_day = today && today.getDate()
  
  let prev = calendarize(new Date(year, month-1), offset)
  let current = calendarize(new Date(year, month), offset)
  let next = calendarize(new Date(year, month+1), offset)
  
  function toPrev() {
    [current, next] = [prev, current]
    
    if (--month < 0) {
      month = 11
      year--
    }
    
    prev = calendarize(new Date(year, month-1), offset)
  }
  
  function toNext() {
    [prev, current] = [current, next]
    
    if (++month > 11) {
      month = 0
      year++
    }
    
    next = calendarize(new Date(year, month+1), offset)
  }
  
  function isToday(day) {
    return today && today_year === year && today_month === month && today_day === day
  }

  function countEntries(date) {
    let start = new Date(year, month, date, 0)
    let end = new Date(year, month, date, 23)

    return msgs.filter(m => {
      console.log(m.value.timestamp)
      console.log(start.getTime())
      console.log(end.getTime())
      return m.value.timestamp >= start.getTime() && m.value.timestamp <= end.getTime()
    }).length
  }

  function showEntries(date) {
    let start = new Date(year, month, date, 0)
    let end = new Date(year, month, date, 23)

    let selectedMsgs = msgs.filter(m => {
      console.log(m.value.timestamp)
      console.log(start.getTime())
      console.log(end.getTime())
      return m.value.timestamp >= start.getTime() && m.value.timestamp <= end.getTime()
    })

    dispatch("showMessages", selectedMsgs)
  }

  pull(
    ssb.sbot.query.read({
      query: [{ 
        $filter: { 
          value: {
            author: ssb.feed,
            content: {
              type: "post",
              recps: [ssb.feed]
            }
          } 
        } }],
      reverse: true
    }),
    pull.filter(m => m.value.content.recps.length = 1 && !m.value.content.hasOwnProperty("mentions")),
    pull.collect((err, data) => {
      msgs = data
      current = calendarize(new Date(year, month), offset)
      console.log("data!", msgs)
    })
  )
</script>

<div class="bg-base-100 p-2 rounded">
<header>
  <Arrow left on:click={toPrev} />
  <h4>{months[month]} {year}</h4>
  <Arrow on:click={toNext} />
</header>

<div class="month">
  {#each labels as txt, idx (txt)}
    <span class="label">{ labels[(idx + offset) % 7] }</span>
  {/each}

  {#each { length:6 } as w,idxw (idxw)}
    {#if current[idxw]}
      {#each { length:7 } as d,idxd (idxd)}
        {#if current[idxw][idxd] != 0}
          <span class="date" class:today={isToday(current[idxw][idxd])}>
            {#if countEntries(current[idxw][idxd]) > 0}
              <div class="date-number">{current[idxw][idxd]}</div> 
              <span on:click={() => showEntries(current[idxw][idxd])} class="badge badge-secondary cursor-pointer badge-outline float-left">{countEntries(current[idxw][idxd])}</span>
            {:else}
              { current[idxw][idxd] }
            {/if}
          </span>
        {:else if (idxw < 1)}
          <span class="date other">{ prev[prev.length - 1][idxd] }</span>
        {:else}
          <span class="date other">{ next[0][idxd] }</span>
        {/if}
      {/each}
    {/if}
  {/each}
</div>
</div>

<style>
  header {
    display: flex;
    margin: 2rem auto;
    align-items: center;
    justify-content: center;
    user-select: none;
  }
  
  h4 {
    display: block;
    text-align: center;
    text-transform: uppercase;
    font-size: 140%;
    margin: 0 1rem;
  }
  
  .month {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: right;
    grid-gap: 4px;
  }
  
  .label {
    font-weight: 300;
    text-align: center;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
    opacity: 0.6;
  }
  
  .date {
    height: 60px;
    font-size: 16px;
    letter-spacing: -1px;
    border: 1px solid #e6e4e4;
    padding-right: 4px;
    font-weight: 700;
    padding: 0.5rem;
  }
  
  .date.today {
    color: #5286fa;
    background: #c4d9fd;
    border-color: currentColor;
  }
  
  .date.other {
    opacity: 0.2;
  }
</style>

