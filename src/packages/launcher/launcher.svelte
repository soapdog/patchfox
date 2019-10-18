<script>
  const { onDestroy } = require("svelte");

  export let active = false;

  let removeHotKey = keymage(
    "ctrl-m",
    () => {
      keymage.pushScope("launcher");
      active = !active;
    },
    { preventDefault: true }
  );

  onDestroy(() => {
    keymage.popScope("launcher");
    removeHotKey();
  });
</script>

<style>

</style>

<div class:active class="modal modal-lg">
  <a href="#close" class="modal-overlay" aria-label="Close" />
  <div class="modal-container">
    <div class="modal-header">
      <a href="#close" class="btn btn-clear float-right" aria-label="Close" />
      <div class="modal-title h5">Modal title</div>
    </div>
    <div class="modal-body">
      <div class="content">
        <!-- content here -->
      </div>
    </div>
    <div class="modal-footer">...</div>
  </div>
</div>
