<script>
  // background Photo by Ray Hennessy on Unsplash
  // https://unsplash.com/photos/9rloii_qmmw

  import Card from "./Card.svelte";

  export let packages;

  for (var p in packages) {
    console.log(`${packages[p].name} ${packages[p].version}`);
  }

  let currentCards = [];
  window.system = {
    newCard: (packageName, data) => {
      if (packages[packageName]) {
        currentCards.push({ package: packages[packageName], data });
      }
    }
  };

  let Navigation = packages.Navigation.package;
</script>

<style type="scss">
  :global(body) {
    background: url(images/bg3.png) repeat;
  }

  .desktop {
    display: flex;
    height: calc(100vh - 25px);
    width: 100vw;
    max-width: 100%;
    padding-top: 45px;
    overflow-x: scroll;
    overflow-y: hidden;
  }
</style>

<div class="backdrop">
  <Navigation />
  <div class="desktop">
    <Card title="public" />

    <Card title="thread: %ksfjggsjgssfgkjbgfkbjsfbskf" />

  </div>
</div>
