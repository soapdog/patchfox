document.getElementById("options-trigger").addEventListener("click", (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    browser.runtime.openOptionsPage();
});