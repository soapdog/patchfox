const triggerComposeWindow = () => {
  browser.sidebarAction.setPanel(
    {
      panel: browser.extension.getURL('components/compose-window/index.html')
    }
  )
  browser.sidebarAction.setTitle({title: 'Patchfox - Compose'})
  browser.sidebarAction.open()
}

document.getElementById('trigger-compose-window').addEventListener('click', triggerComposeWindow)
