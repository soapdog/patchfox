function saveOptions(e) {
  browser.storage.local.set({
    remote: document.querySelector("#sbot_url").value
  });
  e.preventDefault();
}

function restoreOptions() {
  var gettingItem = browser.storage.local.get('remote');
  gettingItem.then((res) => {
    document.querySelector("#sbot_url").value = res.remote || '';
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);