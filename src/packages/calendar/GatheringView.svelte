<script>
  const Card = require("../../core/components/ui/Card.svelte");
  const Scuttle = require("scuttle-gathering");
  const AvatarRound = require("../../core/components/AvatarRound.svelte");
  const gathering = Scuttle(ssb.sbot);
  const ics = require("ics");
  const moment = require("moment");
  const { timestamp } = require("../../core/components/timestamp.js");
  const pull = require("pull-stream");
  const paramap = require("pull-paramap");
  const toPull = require("pull-promise");

  export let msgid;

  let msg = false;
  let name;
  let feed;
  let event = false;
  let loadedAllData = false;
  let showRaw = false;
  let attending;
  let notAttending;
  let image;

  ssb.get(msgid).then(data => {
    msg = {value: data};
    feed = msg.value.author;
    name = feed;


    ssb.avatar(feed).then(data => {
      if (data.image !== null) {
        image = `http://localhost:8989/blobs/get/${data.image}`;
      }
      name = data.name;
    });
  });

  gathering.get(msgid, (err, data) => {
    if (!err) {
      event = data;
      attending = event.isAttendee;
      notAttending = data.notAttendees.includes(ssb.feed);
      loadedAllData = true;
    }
  });

  const dateToNiceDate = epoch => {
    let date = new Date(epoch).toLocaleDateString();
    let time = new Date(epoch).toLocaleTimeString();
    return `${date} ${time}`;
  };

  const attend = () => {
    gathering.attending(msgid, true, (err, data) => {
      console.log(err);
      console.log(data);
      if (!err) {
        attending = true;
        notAttending = false;
      }
    });
  };

  const notAttend = () => {
    gathering.attending(msgid, false, (err, data) => {
      if (!err) {
        notAttending = true;
        attending = false;
      }
    });
  };

  const avatarClick = ev => {
    let feed = ev.detail.feed;
    let name = ev.detail.name;

    patchfox.go("contacts", "profile", { feed });
  };

  const goProfile = ev => {
    if (ev.ctrlKey) {
      window.open(
        `?pkg=contacs&view=profile&feed=${encodeURIComponent(feed)}#/profile`
      );
    } else {
      patchfox.go("contacts", "profile", { feed });
    }
  };

  const exportToICS = ev => {
    pull(
      pull.values(event.attendees),
      paramap((attendee, cb) => {
        ssb.avatar(attendee).then(a => cb(null, { name: a.name, rsvp: true }));
      }),
      pull.collect((err, attendees) => {
        if (err) {
          console.log("err");
          throw err;
          return;
        }
        let el = document.createElement("div");
        el.innerHTML = ssb.markdown(event.description);
        let obj = {
          title: event.title,
          description: el.innerText
        };

        if (event.location) {
          obj.location = event.location;
        }

        obj.start = moment(event.startDateTime.epoch)
          .format("YYYY-M-D-H-m")
          .split("-");

        obj.duration = { hours: 1 };
        obj.organizer = { name: name };
        obj.attendees = attendees;

        let { error, value } = ics.createEvent(obj);

        if (error) {
          throw `Can't generate iCal ${error}`;
        } else {
          let blob = new Blob([value], { type: "text/calendar" });

          const a = document.createElement("a");
          a.style.display = "none";
          document.body.appendChild(a);

          // Set the HREF to a Blob representation of the data to be downloaded
          a.href = window.URL.createObjectURL(blob);

          // Use download attribute to set set desired file name
          a.setAttribute("download", `${event.title}.ics`);

          // Trigger the download by simulating click
          a.click();

          // Cleanup
          window.URL.revokeObjectURL(a.href);
          document.body.removeChild(a);
        }
      })
    );
  };
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
    <h1 class="title">{event.title}</h1>
    {#if event.startDateTime}
      <h2 class="subtitle">{dateToNiceDate(event.startDateTime.epoch)}</h2>
    {/if}
    {#if event.image}
      <img
        class="gathering-image"
        src="http://localhost:8989/blobs/get/{encodeURIComponent(event.image.link)}"
        alt={event.image.name} />
    {/if}
    {@html ssb.markdown(event.description)}
    <h3 class="h3">Attending</h3>
    {#each event.attendees as attendee}
      <span class="contains-avatar">
        <AvatarRound feed={attendee} on:avatarClick={avatarClick} />
      </span>
    {:else}
      <p>This gathering has no atteendees yet</p>
    {/each}
    <h3 class="h3">Not Attending</h3>

    {#each event.notAttendees as notAttendee}
      <span class="contains-avatar">
        <AvatarRound
          dim="true"
          feed={notAttendee}
          on:avatarClick={avatarClick} />
      </span>
    {:else}
      <p>This gathering has no people not attending it yet</p>
    {/each}
    <div class="card-footer" slot="card-footer">
      <div class="columns col-gapless">
        <div class="column col-6">
          <div class="btn-group btn-group-block">
            <button
              class="btn"
              on:click={notAttend}
              class:btn-primary={notAttending === true}>
              Not Attending
            </button>
            <button
              class="btn"
              on:click={attend}
              class:btn-primary={attending === true}>
              Attending
            </button>
          </div>
        </div>
        <div class="column col-6 text-right">
          <button class="btn" disabled={!loadedAllData} on:click={exportToICS}>
            Export as iCal
          </button>
        </div>
      </div>
    </div>
  </Card>
{:else}
  <div class="loading" />
{/if}
