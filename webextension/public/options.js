function saveOptions(e) {
  browser.storage.local.set({
    remote: document.querySelector("#remote").value,
    secret: document.querySelector("#secret").value

  });
  e.preventDefault();
}

function restoreOptions() {
  var getConfig = browser.storage.local.get();
  getConfig.then((res) => {
    document.querySelector("#remote").value = res.remote || '';
    document.querySelector("#secret").value = res.secret || '';
  });

}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
