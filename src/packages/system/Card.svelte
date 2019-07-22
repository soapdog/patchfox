<script>
  export let title = "Untitled";
</script>

<style type="scss">
  .card {
    border: solid 1px #c3c3c3;
    flex: 1 1 auto;
    margin-left: 10px;
    margin-right: 10px;
    min-width: calc(100vw / 3);
    max-height: calc(100vh - 70px);
    backdrop-filter: blur(20px) saturate(125%);
    background-color: rgba(195, 195, 195, 0.6);
    overflow-x: hidden;
    display: flex;

    header.card-title {
      background-color: darken(#a9a9a9, 0.9);
      display: flex;
      flex-direction: column;
      width: 25px;

      h1 {
        flex: 1 1 auto;
        margin: 0;
        padding: 0;
        writing-mode: sideways-lr;
        text-orientation: mixed;
        text-transform: capitalize;
        background-color: #4d4a4a;
        color: #a9a9a9;
        font-weight: normal;
        font-size: 1.1rem;
        font-family: sans-serif;
        padding: 4px;
      }

      span.card-controls {
        width: 25px;
        display: block;
        background-color: #4d4a4a;
        padding-top: 10px;
        padding-bottom: 10px;

        div.card-close {
          width: 10px;
          height: 10px;
          background-color: darkred;
          margin: auto;
          margin-bottom: 10px;
        }

        div.card-minimize {
          width: 10px;
          height: 10px;
          background-color: darkorange;
          margin: auto;
        }
      }
    }
  }
</style>

<section class="card">
  <header class="card-title">
    <span class="card-controls">
      <div class="card-close" />
      <div class="card-minimize" />
    </span>
    <h1>{title}</h1>
  </header>
</section>
