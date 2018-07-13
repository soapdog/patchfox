function remoteFromSecret(e) {
  if (e) {
    e.preventDefault();
  }
  let secret = document.querySelector("#secret").value;
  var secretWithoutComments = [];
  var lines = secret.split('\n');
  for (var i = 0; i < lines.length; i++) {
    if (lines[i][0] !== "#") {
      secretWithoutComments[i] = lines[i];
    }
  }

  let secretObj = JSON.parse(secretWithoutComments.join("\n"));

  console.log("secret", secret);
  if (secretObj.public) {
    let key = secretObj.public.slice(0, -8);
    document.querySelector("#remote").value = `ws://localhost:8989~shs:${key}`;
  } else {
    document.querySelector("#remote").value = `error: ${secretObj}`;
  }

}

function saveOptions(e) {
  if (document.querySelector("#secret").value == '') {
    alert("Can't save empty secret and remote");
    return false;
  }

  if (document.querySelector("#remote").value == '') {
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

function handleFile() {
  var files = this.files
  console.log("files", files)
  var file = files[0];
  var reader = new FileReader();
  reader.onload = function (evt) {
    var content = evt.target.result;
    console.log("content", content)
    document.querySelector("#secret").value = content;
    remoteFromSecret()
  };
  reader.readAsText(file);
}

function clearData(e) {
  browser.storage.local.clear();
  restoreOptions();
  e.preventDefault();
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
document.querySelector("#clear").addEventListener("click", clearData);
document.querySelector("#fileElem").addEventListener('change', handleFile)

