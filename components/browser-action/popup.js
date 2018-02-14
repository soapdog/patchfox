const triggerComposeWindow = () => {
  browser.runtime.sendMessage({type: "open-compose"})
}

document.getElementById('trigger-compose-window').addEventListener('click', triggerComposeWindow)
