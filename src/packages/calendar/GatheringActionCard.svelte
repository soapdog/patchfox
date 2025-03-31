<script>
  const AvatarChip = require("../../core/components/AvatarChip.svelte")
  const Scuttle = require("scuttle-gathering")
  const gathering = Scuttle(ssb.sbot)

  export let msg

  let expression = false
  let msgid = msg.value.content.about
  let encodedid = encodeURIComponent(msgid)
  let label = msgid
  let person = msg.value.author

  if (msg.value.content.attendee && msg.value.content.attendee.link) {
    expression = "attending"
    person = msg.value.content.attendee.link
  }

  if (msg.value.content.notAttendee && msg.value.content.notAttendee.link) {
    expression = "not attending"
    person = msg.value.content.notAttendee.link
  }

  if (msg.value.content.image) {
    expression = "changed the image for"
  }

  if (!expression) {
    expression = "made changes to"
  }

  gathering.get(msgid, (err, data) => {
    if (!err) {
      event = data
      label = event.title || event.description.slice(0, 100) + "..."
    }
  })

  ssb.avatar(msg.value.author).then(data => (person = data.name))

  const goThread = ev => {
    ev.stopPropagation()
    ev.preventDefault()
    if (typeof msgid === "undefined") {
      throw "Can't go to undefined message id"
      return false
    }
    if (ev.ctrlKey) {
      window.open(`?pkg=hub&view=thread&thread=${encodeURIComponent(msgid)}`)
    } else {
      patchfox.go("calendar", "gathering", { msgid })
    }
  }
</script>

<div class="flex m-2">
  <AvatarChip feed={msg.value.author} />
  <p class="m-2">
    <span class="mr-2">&rarr;</span>
    {expression}
    <a href="?pkg=hub&view=calendar&gathering={encodedid}" on:click={goThread}>
      {label}
    </a>
  </p>
</div>
