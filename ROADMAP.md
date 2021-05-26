# ROADMAP

More like _small trail guide_ than an actual _roadmap_. This document is used to hold stuff that I want to check out for the next version. I have ideas for Patchfox during my daily life, and if I don't write it down, I forget them and they're never implemented or fixed.

- Books
    - Bug: `images` might be an `Object` instead of an `Array`. The _details view_ already take that into account but the _list view_ doesn't.
    - Feature: add support for comments to books and reviews.
    - Feature: check if importer from goodreads and the storygraph is possible.
- Calendar
    - Bug: missing gatherings on _future events_ feature. I guess it is a bug with the validator.
- Chess
    - Investigate if it is possible to use ssb-chess or even that mithril based client, without using ssb-chess-db.
- Inbox
    - Create new inbox app to deal with private messages.
- Documentation
    - Document keyboard shortcuts.
    - Add docs for missing message types.
    - Add small user guide.
- Settings
    - Refactor the _filtering by message type_. Remove the reliance on _core message types_ and instead reuse the info from the package system to extrapolate messages. This is a major refactors, it affects both `ssb.js` and the settings package.
- General
    - History management has a quirk where going to a package sometimes enter the data twice into history, or going back doesn't actually go back but reloads the same package. This has been a tricky bug since the start of Patchfox. Symptom is requiring you to click back multiple times before you're actually on the previous package/view combo. Might need a major refactoring.
    - Add support for the new `ssb-uri` from Staltz.
- Package Documentation
    - Make part of the documentation dynamic such as finding out which packages deal with which message types.
