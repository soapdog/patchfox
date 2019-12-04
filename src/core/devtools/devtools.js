let panel

browser.devtools.panels.create(
    "Patchfox Scheme",                      
    "../images/patchfox_pixel_128.png",               
    "panel/scheme.html"    
).then((newPanel) => {
    panel = newPanel
    newPanel.onShown.addListener(initialisePanel);
    newPanel.onHidden.addListener(unInitialisePanel);
});

const initialisePanel = () => {}
const unInitialisePanel = () => {}