const _ = require("lodash");

function menus() {
  let result = [];
  let packagesWithGlobalMenuEntries = _.filter(patchfox.packages, p => p.menu)
  packagesWithGlobalMenuEntries.forEach(p => {
    result.push(p.menu)
  })
  return _.flatten(result)
}

function menuGroups() {
  let ms = menus();
  let groups = {};
  ms.forEach(m => {
    if (m.group && !groups[m.group]) {
      groups[m.group] = [];
    }

    groups[m.group].push(m)
  })
  return groups
}

function triggerMenu(menuItem,) {
  let { package, event, data } = menuItem
  if (package) {
    goToPackage(package)
  }
  emitSync(event, data)
}

module.exports = {
  menus,
  menuGroups,
  triggerMenu
}
