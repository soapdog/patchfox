<script>  
  const pull = require("pull-stream")
  const _ = require("lodash")
  const timeago = require("timeago-simple")
  const MessageRenderer = require("../../core/components/MessageRenderer.svelte")
  
  export let content = ""
  export let msg = {}
  export let msgs = []
  export let error = false
  export let lt = false

  const fetchMessages = ev => {
    console.log("Loading private messages...", lt)
    msgs = []
        
    const createPrivateStream = () => {
      const query = {
        $filter:  {
          value: {
            author: ssb.feed,
            content: {
              type: "post",
              recps: [ssb.feed]
            }
          }
        }
      }
    
      return ssb.sbot.private.read({
        query: [query],
        index: "DTA", // use asserted timestamps
        reverse: true,
      })
    }
    
    const journalMessages = (msg) => {
      console.log(msg)
      let arr = _.get(msg, "value.content.recps", [])
      if (arr.length == 1 && arr[0] == ssb.feed) {
        return true
      }  else {
        return false
      }
    }
    
    pull(
      createPrivateStream(),
      pull.filter(journalMessages),
      pull.collect((err, ms) => {
        if (err) {
          patchfox.go("errorHandler", {
            error: err
          })
        } else {
          msgs = ms
          console.log("msgs", msgs)
        }
      })
    )
  }

  const post = async ev => {
    ev.stopPropagation()
    ev.preventDefault()
    
    try {
      let data = {}
      data.text = content
      data.recps = [ssb.feed]
  
      msg = await ssb.newPrivatePost(data)
      console.log("msg", msg)
      fetchMessages()
      window.scrollTo(0, 0)
    } catch (n) {
      error = true
      msg = `Couldn't post your message: ${n}`
      console.error("Couldn't post", n)
      window.scrollTo(0, 0)
  
      if (msg.message === "stream is closed") {
        msg += ". We lost connection to SSB Server. We'll try to restablish it..."
        window.reload()
      }
    }
  }
  
  fetchMessages()
</script>
<style>
  .journal-column {
    flex: 1 1 auto;
    padding: 5px;
  }
  
  .journal-entry {
    border: solid 1px black;
    padding: 5px;
    margin-top: 5px;
  }
</style>

<div class="container mx-auto flex">
  <div class="journal-column">
    {#each msgs as msg (msg.key)}
      <div class="card bg-base-100 shadow-xl m-2">
        <div class="card-title"><h2 class="p-2">{timeago.simple(new Date(msg.value.timestamp))}</h2></div>
        <div class="card-body">
        <div class="prose prose-sm sm:prose lg:prose-lg xl:prose-xl">
          {@html ssb.markdown(msg.value.content.text)}
        </div>
        </div>
      </div>
    {/each}
  </div>
  <div class="journal-column">
    <div class="form-control">
      <textarea
        class="textarea textarea-bordered h-96"
        id="content"
        placeholder="Type in your journal entry"
        bind:value={content} />
      </div>
      <br>
      <button class="btn btn-primary float-right" on:click={post}>
        Save
      </button>
  </div>
</div>
