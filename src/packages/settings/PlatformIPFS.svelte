<script>
  const { getPref, setPref } = patchfox;
  let enableIPFS = getPref("platform-ipfs-enabled", "yes");
</script>

<h1 class="title">IPFS</h1>
<form class="form-group">
  <label class="form-label">
    Enable integration with <a href="https://ipfs.io" target="_blank">IPFS - The Interplanetary Filesystem</a>?
  </label>
  <label class="form-radio">
    <input
      type="radio"
      name="column-size"
      bind:group={enableIPFS}
      on:change={() => setPref('platform-ipfs-enabled', enableIPFS)}
      value="yes" />
    <i class="form-icon" />
    Yes
  </label>
  <label class="form-radio">
    <input
      type="radio"
      name="column-size"
      bind:group={enableIPFS}
      on:change={() => setPref('platform-ipfs-enabled', enableIPFS)}
      value="no" />
    <i class="form-icon" />
    No
  </label>
</form>
