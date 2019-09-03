console.log("loading")
document.getElementById("options-trigger").addEventListener("click", (ev) => {
  ev.stopPropagation()
  ev.preventDefault()
  if (typeof browser !== "undefined" && browser.runtime) {
    browser.runtime.openOptionsPage()
  } else {
    console.log("not running as a WebExtension")
  }
});
