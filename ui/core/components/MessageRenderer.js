const m = require("mithril")
const GenericMsg = require("./GenericMsg.js")
const _ = require("lodash")
  
const MessageRenderer = {
  view: (vnode) => {
    let msg = vnode.attrs.msg
  
    let messageTypes = []
  
    let packagesForMessageTypes = _.filter(
      patchfox.packages,
      p => p.messageTypes
    )
  
    let type
  
    const makeGenericValidatorForType = typeToBuildFor => {
      return msg => {
        let type
        if (typeof msg.value.content === "string") {
          type = "private"
        } else {
          type = msg.value.content.type
        }
        return type === typeToBuildFor
      }
    }
  
    packagesForMessageTypes.forEach(p => {
      p.messageTypes.forEach(mt => {
        let type = mt.type
        let view = mt.card
        let short = mt.short || false
        let validator = mt.validator || makeGenericValidatorForType(type)
        messageTypes.push({ type, validator, view, short })
      })
    })
  
    let selectedRenderer = false
  
    if (typeof msg.value.content === "string") {
      type = "private"
    } else {
      type = msg.value.content.type ?? "unknown"
    }
  
    for (let p of messageTypes) {
      if (p.validator(msg)) {
        selectedRenderer = p.view
        break
      }
    }
  
    if (!selectedRenderer) {
      selectedRenderer = GenericMsg
    }
    
    return m(selectedRenderer, {msg})
  }
}

module.exports = MessageRenderer

