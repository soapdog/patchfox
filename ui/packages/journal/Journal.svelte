<script>
  const Compose = require("./JournalCompose.svelte")
  const Calendar = require("./JournalCalendar.svelte")

  let msgs = []

  const showMessages = ms => {
    msgs = ms.detail
  }
</script>

<div class="flex">
  <div class="flex-1"><Calendar on:showMessages={showMessages} /></div>
   <div class="flex-1 flex flex-col"> 
    <div class="prose">
    {#each msgs as m}
    <h2>{new Date(m.value.timestamp)}</h2>
    {@html ssb.markdown(m.value.content.text)}
    {/each}
    </div>
  <Compose /></div>
</div>
