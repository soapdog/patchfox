<script>
  const { getPref, setPref } = patchfox;
  let expandByDefault = getPref("content-warnings-expand", "collapsed");
</script>

<h1 class="title">Content Warnings</h1>
<form class="form-group">
  <label class="form-label">
    Should Content Warnings by collapsed or expanded by default?
  </label>
  <label class="form-radio">
    <input
      type="radio"
      name="column-size"
      bind:group={expandByDefault}
      on:change={() => setPref('content-warnings-expand', expandByDefault)}
      value="collapsed" />
    <i class="form-icon" />
    Collapsed
  </label>
  <label class="form-radio">
    <input
      type="radio"
      name="column-size"
      bind:group={expandByDefault}
      on:change={() => setPref('content-warnings-expand', expandByDefault)}
      value="expanded" />
    <i class="form-icon" />
    Expanded
  </label>
</form>
