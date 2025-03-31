<script>  
  const pull = require("pull-stream")
  const _ = require("lodash")
  const timeago = require("timeago-simple")
  const MessageRenderer = require("../../core/components/MessageRenderer.svelte")
  const Tribute = require("tributejs")
  const { onMount } = require("svelte")

  export let content = ""
  export let msg = {}
  export let msgs = []
  export let error = false
  export let lt = false

  let loading = true

  const fetchMessages = ev => {
    console.log("Loading private messages...", lt)
    msgs = []
    loading = true

    const filterLimit = () => {
      let limit = patchfox.getPref("limit", 10)
      return pull.take(Number(limit))
    }
        
    const createPrivateStream = () => {
      const query = {
        $filter:  {
          value: {
            //author: ssb.feed,
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
    
    pull(
      createPrivateStream(),
      filterLimit(),
      pull.collect((err, ms) => {
        loading = false
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
  
  onMount(() => {
    let usersObjs = ssb.getAllCachedUsers()
    let users = []
    loading = true
    for (let id in usersObjs) {
      users.push({
        key: usersObjs[id].name,
        value: `[@${usersObjs[id].name}](${usersObjs[id].id})`
      })
    }
    const tribute = new Tribute({
      values: users,
      selectTemplate: function(item) {
        return item.original.value
      }
    })
  
    tribute.attach(document.getElementById("content"))
    
    fetchMessages()
  })
  
</script>
<style>
  .journal-column {
    flex: 1 1 auto;
    padding: 5px;
    width: 50%;
  }
  
  .journal-entry {
    border: solid 1px black;
    padding: 5px;
    margin-top: 5px;
  }
</style>

<div class="container mx-auto flex">
  <div class="journal-column">
    {#if loading}
      <h2>LOADING</h2>
      <div class="loading loading-lg" />
    {:else}
        {#each msgs as msg (msg.key)}
          <MessageRenderer {msg} />
        {/each}
    {/if}
  </div>
  <div class="journal-column">
    <div class="form-control p-2">
      <textarea
        class="textarea textarea-bordered h-96"
        id="content"
        placeholder="Type in your private message. Don't forget to mention the people you want to send it to."
        bind:value={content} />
      </div>
      <br>
      <button class="btn btn-primary float-right" on:click={post}>
        Save
      </button>
  </div>
</div>
