/**
 * Holds which packages you're loading.
 * 
 * We're not running NodeJS or any build system
 * so the only way for the system to know that it 
 * should load a package is to include it here.
 * 
 * The entries should be relative to this folder.
 * Each package is a default class export.
 */

 import wm from "./wm/wm.js"
 import dock from "./dock/dock.js"

 export const packages = {
   wm,
   dock
 }
