const m = require("mithril")

const Button = {
  view: vnode => {
    let primary = vnode.attrs.primary || false
    let secondary = vnode.attrs.secondary || false
    
    let success = vnode.attrs.success || false
    let warning = vnode.attrs.warning || false 
    let error = vnode.attrs.error || false 
    
    let ghost = vnode.attrs.ghost || false 
    let link = vnode.attrs.link || false 
    
    let loading = vnode.attrs.loading || false
    
    let large = vnode.attrs.large || false 
    let small = vnode.attrs.small || false 
    
    let disabled = vnode.attrs.disabled || false 
    
    const classesForButton = () => {
      let rule = "btn"
      
      if (primary) {
        rule += " btn-primary"
      }
      
      if (secondary) {
        rule += " btn-secondary"
      }
      
      if (success) {
        rule += " btn-success"
      }
      
      if (warning) {
        rule += " btn-warning"
      }
      
      if (error) {
        rule += " btn-error"
      }
      
      if (ghost) {
        rule += " btn-ghost"
      }
      
      if (link) {
        rule += " btn-link"
      }
      
      if (large) {
        rule += " btn-lg"
      }
      
      if (small) {
        rule += " btn-small"
      }
      
      if (disabled) {
        rule += " btn-disabled"
      }
      
      if (outline) {
        rule += " btn-outline"
      }
    }
    
    return m("button", {classes: classesForButton(), onclick: vnode.attrs.onclick}, vnode.children)
  }
}

module.exports = Button
