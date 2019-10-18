<script>
  const { getPref, setPref } = patchfox;
  let enableDAT = getPref("platform-dat-enabled", "yes");
</script>

<h1 class="title">DAT</h1>
<form class="form-group">
  <label class="form-label">
    Enable support for <a href="https://dat.foundation/" target="_blank">DAT</a>?
  </label>
  <label class="form-radio">
    <input
      type="radio"
      name="column-size"
      bind:group={enableDAT}
      on:change={() => setPref('platform-dat-enabled', enableDAT)}
      value="yes" />
    <i class="form-icon" />
    Yes
  </label>
  <label class="form-radio">
    <input
      type="radio"
      name="column-size"
      bind:group={enableDAT}
      on:change={() => setPref('platform-dat-enabled', enableDAT)}
      value="no" />
    <i class="form-icon" />
    No
  </label>
</form>
