# ReindexingDialog Package

The `reindexingDialog` package is responsible for presenting a nice dialog while SSB 
is reindexing the feed. Reindexing may occur when the application downloads data too fast or when 
you switch between apps.

> **Attention:** This package is not loaded when the main UI is run. It is
> not a part of the `packages.js` initialization file.
> 
> It is loaded directly by using the `pkg` argument in the URL directly and
> it is hardcoded in `app.js`.

This dialog will only appear when starting Patchfox. If Patchfox needs to reindex data after the 
main UI has already started, it will display a small progress bar on the bottom of the status bar.

To learn more about that, check the `statusBar` package.

## Source code
* [View package `reindexingDialog` at GitHub](https://github.com/soapdog/patchfox/blob/master/ui/packages/reindexingDialog) 
* [View package `reindexingDialog` at SourceHut](https://git.sr.ht/~soapdog/patchfox/tree/master/item/ui/packages/reindexingDialog)
