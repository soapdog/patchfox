function remoteFromSecret() {
  let secret = document.querySelector("#secret").value;
  let secretObj = JSON.parse(secret);

  if (secretObj.public) {
    let key = secretObj.public.slice(0, -8);
    document.querySelector("#remote").value = `ws://localhost:8989~shs:${key}`;
  }

}

function saveOptions(e) {
  if (document.querySelector("#secret").value = '') {
    alert("Can't save empty secret and remote");
    return false;
  }

  if (document.querySelector("#remote").value = '') {
    remoteFromSecret();
  }

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
document.querySelector("#secret").addEventListener("oninput", remoteFromSecret);

