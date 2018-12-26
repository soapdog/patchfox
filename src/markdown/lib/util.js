module.exports = {
  replaceNewlines: text => text.replace(/\n+(?!$)/g, ' '),
  formatSigilText: sigilText => {
    return sigilText.replace(/^%/, '%25').slice(0, 8) + '...'
  }
}
