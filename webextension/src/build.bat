@echo off

elm make Background.elm --output="../build/background/background.js"

elm make BrowserAction.elm --output="../build/browser_action/browser_action.js"
