function goPublic() {
  browser.tabs.create({
    url: "/index.html?pkg=hub",
  })
  window.close()
}

function goPopular() {
  browser.tabs.create({
    url: "/index.html?pkg=hub&view=popular",
  })
  window.close()
}

function goCompose() {
  browser.tabs.create({
    url: "/index.html?pkg=post&view=compose",
  })
  window.close()
}

function goProfile() {
  browser.tabs.create({
    url: "/index.html?pkg=contacts&view=profile",
  })
  window.close()
}

function goMentions() {
  browser.tabs.create({
    url: "/index.html?pkg=hub&view=mentions",
  })
  window.close()
}

function goInbox() {
  browser.tabs.create({
    url: "/index.html?pkg=inbox",
  })
  window.close()
}

function goChannels() {
  browser.tabs.create({
    url: "/index.html?pkg=hub&view=channels",
  })
  window.close()
}

function goSettings() {
  browser.runtime.openOptionsPage()
  window.close()
}

function goHelp() {
  const url = browser.extension.getURL("docs/index.html")
  browser.tabs.create({
    url: `${url}#/?id=readme`,
  })
  window.close()
}

function goReleaseNotes() {
  const version = browser.runtime.getManifest().version
  const url = browser.extension.getURL(
    `/docs/index.html#/release_notes/${version}`
  )
  browser.tabs.create({
    url: `${url}#/?id=readme`,
  })
  window.close()
}

document.getElementById("options-trigger").addEventListener("click", (ev) => {
  ev.stopPropagation()
  ev.preventDefault()
  goSettings()
})

document.getElementById("go-to-public").addEventListener("click", (ev) => {
  ev.stopPropagation()
  ev.preventDefault()
  goPublic()
})

document.getElementById("go-to-popular").addEventListener("click", (ev) => {
  ev.stopPropagation()
  ev.preventDefault()
  goPopular()
})

document.getElementById("go-to-profile").addEventListener("click", (ev) => {
  ev.stopPropagation()
  ev.preventDefault()
  goProfile()
})

document.getElementById("compose").addEventListener("click", (ev) => {
  ev.stopPropagation()
  ev.preventDefault()
  goCompose()
})

document.getElementById("go-to-help").addEventListener("click", (ev) => {
  ev.stopPropagation()
  ev.preventDefault()
  goHelp()
})

document
  .getElementById("go-to-release-notes")
  .addEventListener("click", (ev) => {
    ev.stopPropagation()
    ev.preventDefault()
    goReleaseNotes()
  })

document.getElementById("go-to-mentions").addEventListener("click", (ev) => {
  ev.stopPropagation()
  ev.preventDefault()
  goMentions()
})

document.getElementById("go-to-inbox").addEventListener("click", (ev) => {
  ev.stopPropagation()
  ev.preventDefault()
  goInbox()
})

keymage("p", goPublic)
keymage("o", goPopular)
keymage("s", goSettings)
keymage("c", goCompose)
keymage("n", goChannels)
keymage("m", goMentions)
keymage("i", goInbox)
keymage("f", goProfile)

const version = browser.runtime.getManifest().version
document.getElementById("patchfox-header").innerText = `Patchfox ${version}`
