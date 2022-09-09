# Scripts
All files in here are related to developing patchfox itself and are not part of the codebase of the add-on.


### `copy-package-docs.js` 

this script picks the documentation that is bundled with each package in `ui/packages/` and place them in `docs/` while processing them further so that they have links to source-code and related materials. This script is run by the release generation task.

It also does some dance moves with the release notes for the current release.

### `make-release.js`

Creates a new release and upload the assets to Github. The build happens locally. Mac universal builds are not working inside Github Actions for some reason but work fine from my machine.

Having this all happen locally also helps avoid lock-in to GH.
