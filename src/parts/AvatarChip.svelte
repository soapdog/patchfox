<script>
  export let feed;

  let image = "images/icon.png";
  let name = feed;

  ssb.avatar(feed).then(data => {
    if (data.image !== null) {
      image = `http://localhost:8989/blobs/get/${data.image}`;
    }
    name = data.name;
  });
</script>

<div class="tile tile-centered">
  <div class="tile-icon">
    <div class="example-tile-icon">
      <img src={image} class="avatar avatar-lg" alt={feed} />
    </div>
  </div>
  <div class="tile-content">
    <div class="tile-title">{name}</div>
    <small class="tile-subtitle text-gray">14MB · Public · 1 Jan, 2017</small>
  </div>
</div>
