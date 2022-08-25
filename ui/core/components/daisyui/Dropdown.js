const m = require("mithril")

const Dropdown = {
	const view: vnode => {
		let selectors = "dropdown"
		
		if (vnode.attrs?.alignEnd) {
			selectors += " dropdown-end"
		}
		
		if (vnode.attrs?.openFromTop) {
			selectors += " dropdown-top"
		}
		
		if (vnode.attrs?.openFromTop) {
			selectors += " dropdown-left"
		}
		
		if (vnode.attrs?.openFromRight) {
			selectors += " dropdown-right"
		}
		
		if (vnode.attrs?.openOnHover) {
			selectors += " dropdown-hover"
		}
		
		if (vnode.attrs?.isOpen) {
			selectors += " dropdown-open"
		}
		
		let buttonSelectors = "btn m-1"
		if (vnode.attrs?.button) {
			buttonSelectors = vnode.attrs.button
		}
		
		let dropdownSelectors = "dropdown-content menu"
		if (vnode.attrs?.dropdownSelectors) {
			dropdownSelectors += vnode.attrs.dropdownSelectors
		}
		
		return m("div", {classes: selectors}, [
			m("label", {tabindex: "0", class: buttonSelectors}, vnode.attrs.label),
			m("ul", {tabindex:"0", class: dropdownSelectors}, vnode.children)
		])
	}
}

module.exports = Dropdown